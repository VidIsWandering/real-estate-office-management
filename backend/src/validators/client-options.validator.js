const { query } = require('express-validator');
const { PAGINATION } = require('../config/constants');

const clientOptionsValidator = [
  query('page')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ gt: 0, lte: PAGINATION.MAX_LIMIT })
    .withMessage(`Limit must be between 1 and ${PAGINATION.MAX_LIMIT}`),

  // Use same query key as repository: full_name
  query('search')
    .optional()
    .isString()
    .withMessage('Search must be a string')
    .isLength({ max: 200 })
    .withMessage('Search must be at most 200 characters'),
];

module.exports = {
  clientOptionsValidator,
};
