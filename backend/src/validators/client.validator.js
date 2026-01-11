const { body } = require('express-validator');
const { CLIENT_TYPES } = require('../config/constants');

const createValidator = [
  // Full name
  body('full_name')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),

  // Email
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  // Phone number
  body('phone_number')
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone('vi-VN')
    .withMessage('Invalid Vietnamese phone number'),

  // Address
  body('address')
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5 })
    .withMessage('Address is too short'),

  // Client type
  body('type')
    .notEmpty().withMessage('Client type is required')
    .isIn(Object.values(CLIENT_TYPES))
    .withMessage('Type must be: buyer, seller, landlord, tenant'),

  // Referral source
  body('referral_src')
    .notEmpty().withMessage('Referral source is required')
    .isLength({ max: 50 })
    .withMessage('Referral source is too long'),

  // Requirement
  body('requirement')
    .notEmpty().withMessage('Requirement is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Requirement must be 5–500 characters'),
];

module.exports = {
  createValidator,
};
