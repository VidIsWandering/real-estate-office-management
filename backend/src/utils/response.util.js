

const { HTTP_STATUS } = require('../config/constants');

/**
 * Success response
 */
const successResponse = (res, data, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Success response with pagination
 */
const successResponseWithPagination = (
  res, 
  data, 
  pagination, 
  message = 'Success', 
  statusCode = HTTP_STATUS.OK
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

/**
 * Error response
 */
const errorResponse = (
  res, 
  message = 'Internal Server Error', 
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Validation error response
 */
const validationErrorResponse = (res, errors) => {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message: 'Validation failed',
    errors: errors.map(err => ({
      field: err.path || err.param,
      message: err.msg,
    })),
  });
};

/**
 * Not found response
 */
const notFoundResponse = (res, resource = 'Resource') => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `${resource} not found`,
  });
};

/**
 * Unauthorized response
 */
const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return res.status(HTTP_STATUS.UNAUTHORIZED).json({
    success: false,
    message,
  });
};

/**
 * Forbidden response
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
  return res.status(HTTP_STATUS.FORBIDDEN).json({
    success: false,
    message,
  });
};

module.exports = {
  successResponse,
  successResponseWithPagination,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
};