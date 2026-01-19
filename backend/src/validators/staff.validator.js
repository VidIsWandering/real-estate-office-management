/**
 * Staff Validation Middleware
 */

const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('../utils/error.util');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    throw new AppError(errorMessages.join(', '), HTTP_STATUS.BAD_REQUEST);
  }
  next();
};

/**
 * Validate staff creation
 */
const validateStaffCreate = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 50 })
    .withMessage('Full name must not exceed 50 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 50 })
    .withMessage('Email must not exceed 50 characters'),

  body('phone_number')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format')
    .isLength({ max: 12 })
    .withMessage('Phone number must not exceed 12 characters'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Address must not exceed 100 characters'),

  body('assigned_area')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assigned area must not exceed 100 characters'),

  body('position')
    .optional()
    .isIn(['agent', 'legal_officer', 'accountant', 'manager'])
    .withMessage(
      'Position must be one of: agent, legal_officer, accountant, manager'
    ),

  body('status')
    .optional()
    .isIn(['working', 'off_duty'])
    .withMessage('Status must be either working or off_duty'),

  handleValidationErrors,
];

/**
 * Validate staff update
 */
const validateStaffUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid staff ID'),

  body('full_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Full name must not exceed 50 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 50 })
    .withMessage('Email must not exceed 50 characters'),

  body('phone_number')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format')
    .isLength({ max: 12 })
    .withMessage('Phone number must not exceed 12 characters'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Address must not exceed 100 characters'),

  body('assigned_area')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Assigned area must not exceed 100 characters'),

  body('position')
    .optional()
    .isIn(['agent', 'legal_officer', 'accountant', 'manager'])
    .withMessage(
      'Position must be one of: agent, legal_officer, accountant, manager'
    ),

  body('status')
    .optional()
    .isIn(['working', 'off_duty'])
    .withMessage('Status must be either working or off_duty'),

  handleValidationErrors,
];

/**
 * Validate staff status update
 */
const validateStaffStatusUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid staff ID'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['working', 'off_duty'])
    .withMessage('Status must be either working or off_duty'),

  handleValidationErrors,
];

/**
 * Validate staff permissions update
 */
const validateStaffPermissionsUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid staff ID'),

  body('position')
    .notEmpty()
    .withMessage('Position is required')
    .isIn(['agent', 'legal_officer', 'accountant', 'manager'])
    .withMessage(
      'Position must be one of: agent, legal_officer, accountant, manager'
    ),

  handleValidationErrors,
];

/**
 * Validate staff ID parameter
 */
const validateStaffId = [
  param('id').isInt({ min: 1 }).withMessage('Invalid staff ID'),

  handleValidationErrors,
];

/**
 * Validate query parameters for staff list
 */
const validateStaffQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('position')
    .optional()
    .isIn(['agent', 'legal_officer', 'accountant', 'manager'])
    .withMessage('Invalid position filter'),

  query('status')
    .optional()
    .isIn(['working', 'off_duty'])
    .withMessage('Invalid status filter'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query must not exceed 100 characters'),

  handleValidationErrors,
];

module.exports = {
  validateStaffCreate,
  validateStaffUpdate,
  validateStaffStatusUpdate,
  validateStaffPermissionsUpdate,
  validateStaffId,
  validateStaffQuery,
};
