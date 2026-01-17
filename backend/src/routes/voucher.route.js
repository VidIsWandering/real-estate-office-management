/**
 * Voucher Routes
 */

const express = require('express');
const router = express.Router();

const voucherController = require('../controllers/voucher.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { STAFF_ROLES } = require('../config/constants');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/vouchers
 * @desc    Get all vouchers
 * @access  Private
 */
router.get('/', voucherController.getAll);

/**
 * @route   GET /api/v1/vouchers/:id
 * @desc    Get voucher by ID
 * @access  Private
 */
router.get('/:id', voucherController.getById);

/**
 * @route   POST /api/v1/vouchers
 * @desc    Create new voucher
 * @access  Private (Accountant/Staff only)
 */
router.post(
  '/',
  authorize([STAFF_ROLES.STAFF, STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  voucherController.create
);

/**
 * @route   PUT /api/v1/vouchers/:id
 * @desc    Update voucher
 * @access  Private (Accountant/Staff only)
 */
router.put(
  '/:id',
  authorize([STAFF_ROLES.STAFF, STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  voucherController.update
);

/**
 * @route   PATCH /api/v1/vouchers/:id/confirm
 * @desc    Confirm voucher
 * @access  Private (Accountant/Staff only)
 */
router.patch(
  '/:id/confirm',
  authorize([STAFF_ROLES.STAFF, STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]),
  voucherController.confirm
);

module.exports = router;
