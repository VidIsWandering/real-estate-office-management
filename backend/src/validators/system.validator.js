/**
 * System Validation Schemas
 */

const { body } = require('express-validator');

/**
 * Validation for updating system configuration
 */
const updateConfigSchema = [
  body('company_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company name must be 1-100 characters'),

  body('company_address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Company address must not exceed 200 characters'),

  body('company_phone')
    .optional()
    .trim()
    .matches(/^[0-9]{10,12}$/)
    .withMessage('Phone number must be 10-12 digits'),

  body('company_email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format'),

  body('working_hours')
    .optional()
    .isObject()
    .withMessage('Working hours must be an object'),

  body('working_hours.start')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:mm)'),

  body('working_hours.end')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:mm)'),

  body('appointment_duration_default')
    .optional()
    .isInt({ min: 15, max: 240 })
    .withMessage('Appointment duration must be between 15-240 minutes'),

  body('notification_settings')
    .optional()
    .isObject()
    .withMessage('Notification settings must be an object'),
];

module.exports = {
  updateConfigSchema,
};
