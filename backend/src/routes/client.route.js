/**
 * Client Routes
 */

const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { createValidator, updateValidator, idParamValidator } = require('../validators/client.validator');
const { addClientNoteValidator } = require('../validators/client-note.validator');
const { clientOptionsValidator } = require('../validators/client-options.validator');
const { validate } = require('../middlewares/validate.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/clients
 * @desc    Get all clients
 * @access  Private
 */
router.get('/', clientController.getAll);

/**
 * @route   GET /api/v1/clients/options
 * @desc    Lightweight client options for dropdowns
 * @access  Private
 */
router.get('/options', clientOptionsValidator, validate, clientController.getOptions);

/**
 * @route   GET /api/v1/clients/:id
 * @desc    Get client by ID
 * @access  Private
 */
router.get('/:id', clientController.getById);

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
router.put('/:id', updateValidator, validate, clientController.update);

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
router.get('/:id/notes', idParamValidator, validate, clientController.getNotes);
router.post('/:id/notes', addClientNoteValidator, validate, clientController.addNote);

module.exports = router;
