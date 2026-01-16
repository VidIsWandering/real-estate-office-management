/**
 * Client Routes
 */

const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { createValidator } = require('../validators/client.validator');
const { validate } = require('../middlewares/validate.middleware');
const { asyncHandler } = require('../middlewares/error.middleware');


// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/clients
 * @desc    Get all clients
 * @access  Private
 */
router.get('/', asyncHandler(clientController.getAll))

/**
 * @route   GET /api/v1/clients/:id
 * @desc    Get client by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(clientController.getById));

/**
 * @route   POST /api/v1/clients
 * @desc    Create new client
 * @access  Private
 */
router.post('/', createValidator, validate, clientController.create);

/**
 * @route   PUT /api/v1/clients/:id
 * @desc    Update client
 * @access  Private
 */
router.put('/:id', clientController.update);

/**
 * @route   DELETE /api/v1/clients/:id
 * @desc    Delete client
 * @access  Private
 */
router.delete('/:id', clientController.delete);

/**
 * @route   GET /api/v1/clients/:id/notes
 * @desc    Get client contact notes
 * @access  Private
 */
router.get('/:id/notes', clientController.getNotes);

/**
 * @route   POST /api/v1/clients/:id/notes
 * @desc    Add client contact note
 * @access  Private
 */
router.post('/:id/notes', clientController.addNote);

module.exports = router;
