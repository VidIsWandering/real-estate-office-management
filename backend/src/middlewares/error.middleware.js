/**
 * Error Middleware - Xử lý lỗi tập trung
 */

const logger = require('../utils/logger.util');
const { HTTP_STATUS } = require('../config/constants');
const config = require('../config/environment');
const { ApiError } = require('../utils/apiError');

/**
 * Not Found Handler - 404
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    HTTP_STATUS.NOT_FOUND,
    `Route not found - ${req.originalUrl}`,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

/**
 * Convert known errors to ApiError
 */
const normalizeError = (err) => {
  // Already an ApiError
  if (err instanceof ApiError) {
    return err;
  }

  // Database errors (PostgreSQL)
  if (err.code && typeof err.code === 'string') {
    switch (err.code) {
      case '23505': // Unique violation
        return new ApiError(
          HTTP_STATUS.CONFLICT,
          extractDuplicateField(err.detail) || 'Dữ liệu đã tồn tại',
          'DUPLICATE_ENTRY',
          { constraint: err.constraint }
        );
      case '23503': // Foreign key violation
        return new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          'Dữ liệu tham chiếu không tồn tại',
          'FOREIGN_KEY_VIOLATION',
          { constraint: err.constraint }
        );
      case '23502': // Not null violation
        return new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          `Trường ${err.column || 'bắt buộc'} không được để trống`,
          'NOT_NULL_VIOLATION',
          { column: err.column }
        );
      case '22P02': // Invalid text representation
        return new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          'Định dạng dữ liệu không hợp lệ',
          'INVALID_DATA_FORMAT'
        );
      case '22003': // Numeric value out of range
        return new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          'Giá trị số vượt quá giới hạn cho phép',
          'NUMERIC_OUT_OF_RANGE'
        );
      case '42P01': // Undefined table
        return new ApiError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          'Lỗi cơ sở dữ liệu',
          'DATABASE_ERROR'
        );
      default:
        if (err.code.startsWith('22') || err.code.startsWith('23')) {
          return new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            'Lỗi dữ liệu',
            'DATABASE_CONSTRAINT_ERROR',
            { pgCode: err.code }
          );
        }
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Token không hợp lệ',
      'INVALID_TOKEN'
    );
  }

  if (err.name === 'TokenExpiredError') {
    return new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Token đã hết hạn',
      'TOKEN_EXPIRED'
    );
  }

  if (err.name === 'NotBeforeError') {
    return new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Token chưa có hiệu lực',
      'TOKEN_NOT_ACTIVE'
    );
  }

  // Joi validation errors
  if (err.isJoi || err.name === 'ValidationError') {
    const details = err.details?.map((d) => ({
      field: d.path?.join('.') || d.context?.key,
      message: d.message,
    }));
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Dữ liệu không hợp lệ',
      'VALIDATION_ERROR',
      details
    );
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    const messages = {
      LIMIT_FILE_SIZE: 'File quá lớn',
      LIMIT_FILE_COUNT: 'Quá nhiều file',
      LIMIT_UNEXPECTED_FILE: 'Trường file không hợp lệ',
    };
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      messages[err.code] || 'Lỗi upload file',
      'FILE_UPLOAD_ERROR',
      { multerCode: err.code }
    );
  }

  // Syntax errors (bad JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'JSON không hợp lệ',
      'INVALID_JSON'
    );
  }

  // Default: unknown error
  return new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    config.node_env === 'production' ? 'Lỗi hệ thống' : err.message,
    'INTERNAL_ERROR'
  );
};

/**
 * Extract duplicate field name from PostgreSQL error detail
 */
const extractDuplicateField = (detail) => {
  if (!detail) return null;

  // Format: Key (email)=(test@test.com) already exists.
  const match = detail.match(/Key \(([^)]+)\)/);
  if (match) {
    const field = match[1];
    const fieldLabels = {
      email: 'Email',
      phone_number: 'Số điện thoại',
      username: 'Tên đăng nhập',
      id_card_number: 'Số CMND/CCCD',
    };
    return `${fieldLabels[field] || field} đã được sử dụng`;
  }
  return null;
};

/**
 * Global Error Handler
 * Note: Express requires 4 parameters (err, req, res, next)
 */
const errorHandler = (err, req, res) => {
  // Normalize error to ApiError
  const error = normalizeError(err);

  // Log error
  const logData = {
    code: error.code,
    message: error.message,
    statusCode: error.statusCode,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.staffId || req.user?.accountId || null,
  };

  if (error.statusCode >= 500 || config.node_env === 'development') {
    logData.stack = err.stack;
    logData.originalError = err.message;
  }

  // Use appropriate log level
  if (error.statusCode >= 500) {
    logger.error('Server Error:', logData);
  } else if (error.statusCode >= 400) {
    logger.warn('Client Error:', logData);
  }

  // Build response object
  const response = {
    success: false,
    error: {
      code: error.code || 'ERROR',
      message: error.message,
    },
  };

  if (error.details) response.error.details = error.details;
  if (config.node_env === 'development') response.error.stack = err.stack;

  return res.status(error.statusCode).json(response);
};

/**
 * Async handler wrapper - Bắt lỗi từ async functions
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validate request middleware factory
 */
const validate =
  (schema, property = 'body') =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return next(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          'Dữ liệu không hợp lệ',
          'VALIDATION_ERROR',
          details
        )
      );
    }

    req[property] = value;
    next();
  };

/**
 * Handle uncaught exceptions and unhandled rejections
 */
const setupGlobalErrorHandlers = () => {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', {
      message: error.message,
      stack: error.stack,
    });
    setTimeout(() => process.exit(1), 1000);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', {
      reason: reason?.message || reason,
      stack: reason?.stack,
    });
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
  asyncHandler,
  validate,
  normalizeError,
  setupGlobalErrorHandlers,
};
