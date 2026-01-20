const { body, param } = require('express-validator');

const addClientNoteValidator = [
  param('id')
    .notEmpty()
    .withMessage('Client ID is required')
    .isInt({ gt: 0 })
    .withMessage('Client ID must be a positive integer'),

  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be between 1 and 2000 characters'),
];

module.exports = {
  addClientNoteValidator,
};
