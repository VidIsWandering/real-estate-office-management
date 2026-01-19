/**
 * System Routes
 */

const express = require('express');
const router = express.Router();

const systemController = require('../controllers/system.controller');
// const voucherController = require('../controllers/voucher.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { updateConfigSchema } = require('../validators/system.validator');
const { STAFF_ROLES } = require('../config/constants');

// ============================================================================
// Public routes (for terms - basic access)
// ============================================================================

/**
 * @route   GET /api/v1/terms
 * @desc    Get all terms
 * @access  Private
 */
router.get('/terms', authenticate, systemController.getTerms);

// ============================================================================
// Protected routes
// ============================================================================

/**
//  * @route   GET /api/v1/debts
//  * @desc    Get outstanding debts
//  * @access  Private
//  */
// router.get('/debts', authenticate, voucherController.getDebts);

/**
 * @route   GET /api/v1/logs
 * @desc    Get system logs
 * @access  Private (Manager/Admin only)
 */
router.get(
  '/logs',
  authenticate,
  authorize([STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  systemController.getLogs
);

/**
 * @route   GET /api/v1/system/config
 * @desc    Get system configuration
 * @access  Private (Manager/Admin only)
 */
router.get(
  '/system/config',
  authenticate,
  authorize([STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  systemController.getConfig
);

/**
 * @route   GET /api/v1/system/configs
 * @desc    Get all system configurations as array
 * @access  Private (Manager/Admin only)
 */
router.get(
  '/system/configs',
  authenticate,
  authorize([STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  systemController.getAllConfigs
);

/**
 * @route   PUT /api/v1/system/config
 * @desc    Update system configuration
 * @access  Private (Admin only)
 */
router.put(
  '/system/config',
  authenticate,
  authorize([STAFF_ROLES.ADMIN]),
  ...updateConfigSchema,
  validate,
  systemController.updateConfig
);

/**
 * @route   PUT /api/v1/system/configs/:key
 * @desc    Update individual system configuration
 * @access  Private (Manager/Admin only)
 */
router.put(
  '/system/configs/:key',
  authenticate,
  authorize([STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  systemController.updateSingleConfig
);

/**
 * @route   POST /api/v1/terms
 * @desc    Create new term
 * @access  Private (Manager/Admin only)
 */
router.post(
  '/terms',
  authenticate,
  authorize([STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  systemController.createTerm
);

/**
 * @route   PUT /api/v1/terms/:id
 * @desc    Update term
 * @access  Private (Manager/Admin only)
 */
router.put(
  '/terms/:id',
  authenticate,
  authorize([STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  systemController.updateTerm
);

/**
 * @route   DELETE /api/v1/terms/:id
 * @desc    Delete term
 * @access  Private (Manager/Admin only)
 */
router.delete(
  '/terms/:id',
  authenticate,
  authorize([STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  systemController.deleteTerm
);

module.exports = router;
