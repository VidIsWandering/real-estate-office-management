// src/utils/apiError.js

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error codes mapping
 */
const ErrorCodes = {
  // Validation errors
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 400 },
  INVALID_DATE_RANGE: { code: 'INVALID_DATE_RANGE', status: 400 },
  INVALID_STAFF_ID: { code: 'INVALID_STAFF_ID', status: 400 },

  // Authentication errors
  UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401 },
  INVALID_TOKEN: { code: 'INVALID_TOKEN', status: 401 },
  TOKEN_EXPIRED: { code: 'TOKEN_EXPIRED', status: 401 },

  // Authorization errors
  FORBIDDEN: { code: 'FORBIDDEN', status: 403 },

  // Not found errors
  NOT_FOUND: { code: 'NOT_FOUND', status: 404 },
  STAFF_NOT_FOUND: { code: 'STAFF_NOT_FOUND', status: 404 },
  CONTRACT_NOT_FOUND: { code: 'CONTRACT_NOT_FOUND', status: 404 },

  // Server errors
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500 },
  EXPORT_FAILED: { code: 'EXPORT_FAILED', status: 500 },
  DATABASE_ERROR: { code: 'DATABASE_ERROR', status: 500 },
};

/**
 * Create ApiError from error code
 */
const createError = (errorCode, message = null, details = null) => {
  const error = ErrorCodes[errorCode] || ErrorCodes.INTERNAL_ERROR;
  return new ApiError(error.status, message || errorCode, details);
};

module.exports = {
  ApiError,
  ErrorCodes,
  createError,
};
