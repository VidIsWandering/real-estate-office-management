/**
 * Security Validators - Request validation for security endpoints
 */

const { param, query, body } = require('express-validator');

/**
 * Validate session ID parameter
 */
const sessionIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Session ID must be a positive integer'),
];

/**
 * Validate login history query parameters
 */
const loginHistoryValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

/**
 * Validate revoke all sessions request
 */
const revokeAllSessionsValidator = [
  body('current_session_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Current session ID must be a positive integer'),
];

/**
 * Validate 2FA token
 */
const verify2FAValidator = [
  body('token')
    .notEmpty()
    .withMessage('Token is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Token must be 6 digits')
    .isNumeric()
    .withMessage('Token must be numeric'),
];

module.exports = {
  sessionIdValidator,
  loginHistoryValidator,
  revokeAllSessionsValidator,
  verify2FAValidator,
};
