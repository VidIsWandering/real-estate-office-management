const { body, param, query } = require('express-validator');
const { CLIENT_TYPES } = require('../config/constants');

const createValidator = [
  body('full_name')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('phone_number')
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone('vi-VN').withMessage('Invalid Vietnamese phone number'),

  body('address')
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5 }).withMessage('Address is too short'),

  body('type')
    .notEmpty().withMessage('Client type is required')
    .isIn(Object.values(CLIENT_TYPES))
    .withMessage(`Type must be one of: ${Object.values(CLIENT_TYPES).join(', ')}`),

  body('referral_src')
    .notEmpty().withMessage('Referral source is required')
    .isLength({ max: 50 }).withMessage('Referral source is too long'),

  body('requirement')
    .notEmpty().withMessage('Requirement is required')
    .isLength({ min: 5, max: 500 }).withMessage('Requirement must be 5–500 characters'),
];

// ----------------- UPDATE -----------------
const updateValidator = [
  param('id')
    .notEmpty().withMessage('Client ID is required')
    .isInt({ gt: 0 }).withMessage('Client ID must be a positive integer'),

  body('full_name').optional().isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),

  body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),

  body('phone_number').optional().isMobilePhone('vi-VN')
    .withMessage('Invalid Vietnamese phone number'),

  body('address').optional().isLength({ min: 5 }).withMessage('Address is too short'),

  body('type').optional().isIn(Object.values(CLIENT_TYPES))
    .withMessage(`Type must be one of: ${Object.values(CLIENT_TYPES).join(', ')}`),

  body('referral_src').optional().isLength({ max: 50 }).withMessage('Referral source is too long'),

  body('requirement').optional().isLength({ min: 5, max: 500 })
    .withMessage('Requirement must be 5–500 characters'),
];

// ----------------- GET BY ID / DELETE -----------------
const idParamValidator = [
  param('id')
    .notEmpty().withMessage('Client ID is required')
    .isInt({ gt: 0 }).withMessage('Client ID must be a positive integer')
];

// ----------------- GET ALL -----------------
const getAllValidator = [
  query('page')
    .optional()
    .isInt({ gt: 0 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ gt: 0 }).withMessage('Limit must be a positive integer'),

  query('full_name')
    .optional()
    .isString().withMessage('Full name filter must be a string'),

  query('email')
    .optional()
    .isEmail().withMessage('Email filter must be a valid email')
    .normalizeEmail(),

  query('phone_number')
    .optional()
    .isMobilePhone('vi-VN').withMessage('Phone number filter must be a valid Vietnamese phone number'),

  query('type')
    .optional()
    .isIn(Object.values(CLIENT_TYPES))
    .withMessage(`Type filter must be one of: ${Object.values(CLIENT_TYPES).join(', ')}`),

  query('address')
    .optional()
    .isString().withMessage('Address filter must be a string'),

  query('staff_id')
    .optional()
    .isInt({ gt: 0 }).withMessage('Staff ID must be a positive integer'), // 🔹 Thêm staff_id
];

// Export tất cả validator
module.exports = {
  createValidator,
  updateValidator,
  idParamValidator,
  getAllValidator,
};
