/**
 * Contract Routes
 */

const express = require('express');
const router = express.Router();

const contractController = require('../controllers/contract.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { STAFF_ROLES } = require('../config/constants');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/contracts
 * @desc    Get all contracts
 * @access  Private
 */
router.get('/', contractController.getAll);

/**
 * @route   GET /api/v1/contracts/:id
 * @desc    Get contract by ID
 * @access  Private
 */
router.get('/:id', contractController.getById);

/**
 * @route   POST /api/v1/contracts
 * @desc    Create new contract
 * @access  Private (Legal Officer/Staff only)
 */
router.post(
  '/',
  authorize([STAFF_ROLES.STAFF, STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  contractController.create
);

/**
 * @route   PUT /api/v1/contracts/:id
 * @desc    Update contract
 * @access  Private (Legal Officer/Staff only)
 */
router.put(
  '/:id',
  authorize([STAFF_ROLES.STAFF, STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  contractController.update
);

/**
 * @route   PATCH /api/v1/contracts/:id/status
 * @desc    Update contract status
 * @access  Private (Legal Officer/Staff only)
 */
router.patch(
  '/:id/status',
  authorize([STAFF_ROLES.STAFF, STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  contractController.updateStatus
);

/**
 * @route   POST /api/v1/contracts/:id/files
 * @desc    Upload contract files
 * @access  Private
 */
router.post('/:id/files', contractController.uploadFiles);

/**
 * @route   GET /api/v1/contracts/:id/files
 * @desc    Get contract files
 * @access  Private
 */
router.get('/:id/files', contractController.getFiles);

module.exports = router;
