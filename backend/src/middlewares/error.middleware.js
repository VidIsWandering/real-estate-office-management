/**
 * Error Middleware - Xử lý lỗi tập trung
 */

const logger = require('../utils/logger.util');

const { HTTP_STATUS } = require('../config/constants');
const config = require('../config/environment');

/**
 * Not Found Handler - 404
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = HTTP_STATUS.NOT_FOUND;
  next(error);
};

/**
 * Global Error Handler
 */
const errorHandler = (err, req, res) => {
  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Determine status code and message
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';

  // Database errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        statusCode = HTTP_STATUS.CONFLICT;
        message = 'Duplicate entry. Resource already exists';
        break;
      case '23503': // Foreign key violation
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = 'Invalid reference. Related resource not found';
        break;
      case '23502': // Not null violation
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = 'Required field missing';
        break;
      case '22P02': // Invalid text representation
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = 'Invalid data format';
        break;
      default:
        message = 'Database error occurred';
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token expired';
  }

  // Note: Custom error classes (ValidationError, NotFoundError, etc.) from error.util.js
  // already have statusCode set, so they will use their own message and statusCode

  // Response object
  const response = {
    success: false,
    message,
  };

  // Include stack trace in development
  if (config.node_env === 'development') {
    response.stack = err.stack;
    response.error = err;
  }

  return res.status(statusCode).json(response);
};

/**
 * Async handler wrapper - Bắt lỗi từ async functions
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  notFoundHandler,
  errorHandler,
  asyncHandler,
};
