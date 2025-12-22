/**
 * Appointment Routes
 */

const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointment.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/appointments
 * @desc    Get all appointments
 * @access  Private
 */
router.get('/', appointmentController.getAll);

/**
 * @route   GET /api/v1/appointments/:id
 * @desc    Get appointment by ID
 * @access  Private
 */
router.get('/:id', appointmentController.getById);

/**
 * @route   POST /api/v1/appointments
 * @desc    Create new appointment
 * @access  Private
 */
router.post('/', appointmentController.create);

/**
 * @route   PUT /api/v1/appointments/:id
 * @desc    Update appointment
 * @access  Private
 */
router.put('/:id', appointmentController.update);

/**
 * @route   PATCH /api/v1/appointments/:id/status
 * @desc    Update appointment status
 * @access  Private
 */
router.patch('/:id/status', appointmentController.updateStatus);

module.exports = router;
