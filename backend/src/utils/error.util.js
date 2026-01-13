const { HTTP_STATUS } = require('../config/constants');

/**
 * Custom Application Error Class
 */
class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error response
 */
const errorResponse = (
  res,
  message = 'Internal Server Error',
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  data = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(data && { data }),
  });
};

module.exports = {
  AppError,
  errorResponse,
};
