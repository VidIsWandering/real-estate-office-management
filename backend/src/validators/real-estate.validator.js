const { body, param, query } = require('express-validator');
const {
  TRANSACTION_TYPES,
  DIRECTIONS,
  REAL_ESTATE_STATUS,
} = require('../config/constants');

// -----------------------
// CREATE RealEstate
// -----------------------
const createRealEstateValidator = [
  body('title').notEmpty().withMessage('Title is required'),

  body('type').notEmpty().withMessage('Type is required'),

  body('transaction_type')
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage(
      `Transaction type must be one of: ${Object.values(TRANSACTION_TYPES).join(', ')}`
    ),

  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .isString()
    .withMessage('Location must be a string'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  body('area')
    .notEmpty()
    .withMessage('Area is required')
    .isFloat({ gt: 0 })
    .withMessage('Area must be a positive number'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters'),

  body('direction')
    .notEmpty()
    .withMessage('Direction is required')
    .isIn(Object.values(DIRECTIONS))
    .withMessage(
      `Direction must be one of: ${Object.values(DIRECTIONS).join(', ')}`
    ),

  body('owner_id')
    .notEmpty()
    .withMessage('Owner ID is required')
    .isInt({ gt: 0 })
    .withMessage('Owner ID must be a positive integer'),
];

// -----------------------
// UPDATE RealEstate
// -----------------------
const updateRealEstateValidator = [
  // Body fields
  body('title').optional().isString().withMessage('Title must be a string'),

  body('type').optional().isString().withMessage('Type must be a string'),

  body('transaction_type')
    .optional()
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage(
      `Transaction type must be one of: ${Object.values(TRANSACTION_TYPES).join(', ')}`
    ),

  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),

  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  body('area')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Area must be a positive number'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters'),

  body('direction')
    .optional()
    .isIn(Object.values(DIRECTIONS))
    .withMessage(
      `Direction must be one of: ${Object.values(DIRECTIONS).join(', ')}`
    ),

  body('owner_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Owner ID must be a positive integer'),
];

// -----------------------
// GET ALL RealEstate
// -----------------------
const getAllRealEstateValidator = [
  query('page')
    .optional()
    .isInt({ gt: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ gt: 10 })
    .withMessage('Limit must be a positive integer'),

  query('title').optional().isString().withMessage('Title must be a string'),

  query('type').optional().isString().withMessage('Type must be a string'),

  query('transaction_type')
    .optional()
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage(
      `Transaction type must be one of: ${Object.values(TRANSACTION_TYPES).join(', ')}`
    ),

  query('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),

  query('min_price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Min price must be a positive number'),

  query('max_price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Max price must be a positive number'),

  query('min_area')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Min area must be a positive number'),

  query('max_area')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Max area must be a positive number'),

  query('direction')
    .optional()
    .isIn(Object.values(DIRECTIONS))
    .withMessage(
      `Direction must be one of: ${Object.values(DIRECTIONS).join(', ')}`
    ),

  query('owner_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Owner ID must be a positive integer'),

  query('staff_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Staff ID must be a positive integer'),

  query('status')
    .optional()
    .isIn(Object.values(REAL_ESTATE_STATUS))
    .withMessage(
      `Status must be one of: ${Object.values(REAL_ESTATE_STATUS).join(', ')}`
    ),
];

// -----------------------
// GET BY ID / UPDATE BY ID / DELETE RealEstate
// -----------------------
const idParamValidator = [
  param('id').notEmpty().withMessage('ID is required').isInt({ gt: 0 }),
];

module.exports = {
  createRealEstateValidator,
  updateRealEstateValidator,
  getAllRealEstateValidator,
  idParamValidator,
};
