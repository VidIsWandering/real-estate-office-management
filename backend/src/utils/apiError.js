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
 * Error codes mapping - Organized by category
 */
const ErrorCodes = {
  // ============================================
  // VALIDATION ERRORS (400)
  // ============================================
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 400 },
  INVALID_INPUT: { code: 'INVALID_INPUT', status: 400 },
  INVALID_DATE_RANGE: { code: 'INVALID_DATE_RANGE', status: 400 },
  INVALID_DATE_FORMAT: { code: 'INVALID_DATE_FORMAT', status: 400 },
  INVALID_STAFF_ID: { code: 'INVALID_STAFF_ID', status: 400 },
  INVALID_AMOUNT: { code: 'INVALID_AMOUNT', status: 400 },
  INVALID_STATUS: { code: 'INVALID_STATUS', status: 400 },
  INVALID_TYPE: { code: 'INVALID_TYPE', status: 400 },
  INVALID_FILE_TYPE: { code: 'INVALID_FILE_TYPE', status: 400 },
  FILE_TOO_LARGE: { code: 'FILE_TOO_LARGE', status: 400 },
  MISSING_REQUIRED_FIELD: { code: 'MISSING_REQUIRED_FIELD', status: 400 },

  // ============================================
  // AUTHENTICATION ERRORS (401)
  // ============================================
  UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401 },
  INVALID_TOKEN: { code: 'INVALID_TOKEN', status: 401 },
  TOKEN_EXPIRED: { code: 'TOKEN_EXPIRED', status: 401 },
  TOKEN_NOT_PROVIDED: { code: 'TOKEN_NOT_PROVIDED', status: 401 },
  INVALID_CREDENTIALS: { code: 'INVALID_CREDENTIALS', status: 401 },
  ACCOUNT_DISABLED: { code: 'ACCOUNT_DISABLED', status: 401 },

  // ============================================
  // AUTHORIZATION ERRORS (403)
  // ============================================
  FORBIDDEN: { code: 'FORBIDDEN', status: 403 },
  INSUFFICIENT_PERMISSIONS: { code: 'INSUFFICIENT_PERMISSIONS', status: 403 },
  ACCESS_DENIED: { code: 'ACCESS_DENIED', status: 403 },

  // ============================================
  // NOT FOUND ERRORS (404)
  // ============================================
  NOT_FOUND: { code: 'NOT_FOUND', status: 404 },
  RESOURCE_NOT_FOUND: { code: 'RESOURCE_NOT_FOUND', status: 404 },
  STAFF_NOT_FOUND: { code: 'STAFF_NOT_FOUND', status: 404 },
  CLIENT_NOT_FOUND: { code: 'CLIENT_NOT_FOUND', status: 404 },
  CONTRACT_NOT_FOUND: { code: 'CONTRACT_NOT_FOUND', status: 404 },
  VOUCHER_NOT_FOUND: { code: 'VOUCHER_NOT_FOUND', status: 404 },
  REAL_ESTATE_NOT_FOUND: { code: 'REAL_ESTATE_NOT_FOUND', status: 404 },
  TRANSACTION_NOT_FOUND: { code: 'TRANSACTION_NOT_FOUND', status: 404 },
  APPOINTMENT_NOT_FOUND: { code: 'APPOINTMENT_NOT_FOUND', status: 404 },
  FILE_NOT_FOUND: { code: 'FILE_NOT_FOUND', status: 404 },
  ROUTE_NOT_FOUND: { code: 'ROUTE_NOT_FOUND', status: 404 },

  // ============================================
  // CONFLICT ERRORS (409)
  // ============================================
  DUPLICATE_ENTRY: { code: 'DUPLICATE_ENTRY', status: 409 },
  RESOURCE_ALREADY_EXISTS: { code: 'RESOURCE_ALREADY_EXISTS', status: 409 },
  EMAIL_ALREADY_EXISTS: { code: 'EMAIL_ALREADY_EXISTS', status: 409 },
  PHONE_ALREADY_EXISTS: { code: 'PHONE_ALREADY_EXISTS', status: 409 },
  USERNAME_ALREADY_EXISTS: { code: 'USERNAME_ALREADY_EXISTS', status: 409 },

  // ============================================
  // BUSINESS LOGIC ERRORS (400/422)
  // ============================================
  // Voucher specific
  VOUCHER_ALREADY_CONFIRMED: { code: 'VOUCHER_ALREADY_CONFIRMED', status: 400 },
  CANNOT_EDIT_CONFIRMED_VOUCHER: {
    code: 'CANNOT_EDIT_CONFIRMED_VOUCHER',
    status: 400,
  },
  CANNOT_DELETE_CONFIRMED_VOUCHER: {
    code: 'CANNOT_DELETE_CONFIRMED_VOUCHER',
    status: 400,
  },
  INVALID_VOUCHER_TYPE: { code: 'INVALID_VOUCHER_TYPE', status: 400 },
  INVALID_PAYMENT_METHOD: { code: 'INVALID_PAYMENT_METHOD', status: 400 },
  AMOUNT_EXCEEDS_REMAINING: { code: 'AMOUNT_EXCEEDS_REMAINING', status: 400 },

  // Contract specific
  CONTRACT_ALREADY_CANCELLED: {
    code: 'CONTRACT_ALREADY_CANCELLED',
    status: 400,
  },
  CONTRACT_ALREADY_FINALIZED: {
    code: 'CONTRACT_ALREADY_FINALIZED',
    status: 400,
  },
  CANNOT_EDIT_FINALIZED_CONTRACT: {
    code: 'CANNOT_EDIT_FINALIZED_CONTRACT',
    status: 400,
  },
  INVALID_CONTRACT_STATUS_TRANSITION: {
    code: 'INVALID_CONTRACT_STATUS_TRANSITION',
    status: 400,
  },

  // Real Estate specific
  REAL_ESTATE_NOT_AVAILABLE: { code: 'REAL_ESTATE_NOT_AVAILABLE', status: 400 },
  REAL_ESTATE_ALREADY_TRANSACTED: {
    code: 'REAL_ESTATE_ALREADY_TRANSACTED',
    status: 400,
  },
  INVALID_REAL_ESTATE_STATUS: {
    code: 'INVALID_REAL_ESTATE_STATUS',
    status: 400,
  },

  // Transaction specific
  TRANSACTION_ALREADY_COMPLETED: {
    code: 'TRANSACTION_ALREADY_COMPLETED',
    status: 400,
  },
  TRANSACTION_CANCELLED: { code: 'TRANSACTION_CANCELLED', status: 400 },

  // Appointment specific
  APPOINTMENT_TIME_CONFLICT: { code: 'APPOINTMENT_TIME_CONFLICT', status: 400 },
  APPOINTMENT_ALREADY_COMPLETED: {
    code: 'APPOINTMENT_ALREADY_COMPLETED',
    status: 400,
  },
  APPOINTMENT_CANCELLED: { code: 'APPOINTMENT_CANCELLED', status: 400 },
  INVALID_APPOINTMENT_TIME: { code: 'INVALID_APPOINTMENT_TIME', status: 400 },

  // ============================================
  // RATE LIMITING (429)
  // ============================================
  TOO_MANY_REQUESTS: { code: 'TOO_MANY_REQUESTS', status: 429 },
  EXPORT_RATE_LIMITED: { code: 'EXPORT_RATE_LIMITED', status: 429 },

  // ============================================
  // SERVER ERRORS (500)
  // ============================================
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500 },
  DATABASE_ERROR: { code: 'DATABASE_ERROR', status: 500 },
  EXPORT_FAILED: { code: 'EXPORT_FAILED', status: 500 },
  FILE_UPLOAD_FAILED: { code: 'FILE_UPLOAD_FAILED', status: 500 },
  EMAIL_SEND_FAILED: { code: 'EMAIL_SEND_FAILED', status: 500 },
  EXTERNAL_SERVICE_ERROR: { code: 'EXTERNAL_SERVICE_ERROR', status: 500 },

  // ============================================
  // SERVICE UNAVAILABLE (503)
  // ============================================
  SERVICE_UNAVAILABLE: { code: 'SERVICE_UNAVAILABLE', status: 503 },
  DATABASE_UNAVAILABLE: { code: 'DATABASE_UNAVAILABLE', status: 503 },
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
