const { body, param, query } = require('express-validator');
const { APPOINTMENT_STATUS } = require('../config/constants');

// -----------------------
// CREATE Appointment
// -----------------------
const createAppointmentValidator = [
  body('real_estate_id')
    .notEmpty()
    .withMessage('Real estate ID is required')
    .isInt({ gt: 0 })
    .withMessage('Real estate ID must be a positive integer'),

  body('client_id')
    .notEmpty()
    .withMessage('Client ID is required')
    .isInt({ gt: 0 })
    .withMessage('Client ID must be a positive integer'),

  body('staff_id')
    .notEmpty()
    .withMessage('Staff ID is required')
    .isInt({ gt: 0 })
    .withMessage('Staff ID must be a positive integer'),

  body('start_time')
    .notEmpty()
    .withMessage('Start time is required')
    .isISO8601()
    .withMessage('Start time must be a valid datetime'),

  body('end_time')
    .notEmpty()
    .withMessage('End time is required')
    .isISO8601()
    .withMessage('End time must be a valid datetime')
    .custom((endTime, { req }) => {
      if (new Date(endTime) <= new Date(req.body.start_time)) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),

  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string')
    .isLength({ max: 100 })
    .withMessage('Location must be at most 100 characters'),

  body('note')
    .optional()
    .isString()
    .withMessage('Note must be a string')
    .isLength({ max: 1000 })
    .withMessage('Note must be at most 1000 characters'),
];

// -----------------------
// UPDATE Appointment
// -----------------------
const updateAppointmentValidator = [
  body('real_estate_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Real estate ID must be a positive integer'),

  body('client_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Client ID must be a positive integer'),

  body('staff_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Staff ID must be a positive integer'),

  body('start_time')
    .optional()
    .isISO8601()
    .withMessage('Start time must be a valid datetime'),

  body('end_time')
    .optional()
    .isISO8601()
    .withMessage('End time must be a valid datetime')
    .custom((endTime, { req }) => {
      if (
        req.body.start_time &&
        new Date(endTime) <= new Date(req.body.start_time)
      ) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),

  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string')
    .isLength({ max: 100 })
    .withMessage('Location must be at most 100 characters'),

  body('status')
    .optional()
    .isIn(Object.values(APPOINTMENT_STATUS))
    .withMessage(
      `Status must be one of: ${Object.values(APPOINTMENT_STATUS).join(', ')}`
    ),

  body('note')
    .optional()
    .isString()
    .withMessage('Note must be a string')
    .isLength({ max: 1000 })
    .withMessage('Note must be at most 1000 characters'),
];

// -----------------------
// GET ALL Appointment
// -----------------------
const getAllAppointmentValidator = [
  query('real_estate_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Real estate ID must be a positive integer'),

  query('client_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Client ID must be a positive integer'),

  query('staff_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Staff ID must be a positive integer'),

  query('status')
    .optional()
    .isIn(Object.values(APPOINTMENT_STATUS))
    .withMessage(
      `Status must be one of: ${Object.values(APPOINTMENT_STATUS).join(', ')}`
    ),

  query('from_time')
    .optional()
    .isISO8601()
    .withMessage('from_time must be a valid datetime'),

  query('to_time')
    .optional()
    .isISO8601()
    .withMessage('to_time must be a valid datetime'),
];

// -----------------------
// GET BY ID / UPDATE / DELETE Appointment
// -----------------------
const appointmentIdParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('Appointment ID is required')
    .isInt({ gt: 0 })
    .withMessage('Appointment ID must be a positive integer'),
];

module.exports = {
  createAppointmentValidator,
  updateAppointmentValidator,
  getAllAppointmentValidator,
  appointmentIdParamValidator,
};
