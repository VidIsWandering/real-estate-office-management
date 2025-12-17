/**
 * Auth Validators - Validation rules cho authentication
 */

const { body } = require('express-validator');
const { STAFF_ROLES } = require('../config/constants');

/**
 * Register validation
 */
const registerValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3-50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),

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
    .matches(/^[0-9]{10,12}$/)
    .withMessage('Phone number must be 10-12 digits'),

  body('role')
    .optional()
    .isIn(Object.values(STAFF_ROLES))
    .withMessage('Invalid role'),
];

/**
 * Login validation
 */
const loginValidator = [
  body('username').trim().notEmpty().withMessage('Username is required'),

  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Change password validation
 */
const changePasswordValidator = [
  body('old_password').notEmpty().withMessage('Current password is required'),

  body('new_password')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),

  body('confirm_password')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
};
