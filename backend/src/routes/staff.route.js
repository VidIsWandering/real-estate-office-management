/**
 * Staff Routes
 */

const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staff.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { STAFF_ROLES } = require('../config/constants');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/staff
 * @desc    Get all staff
 * @access  Private
 */
router.get('/', staffController.getAll);

/**
 * @route   GET /api/v1/staff/:id
 * @desc    Get staff by ID
 * @access  Private
 */
router.get('/:id', staffController.getById);

/**
 * @route   POST /api/v1/staff
 * @desc    Create new staff
 * @access  Private (Manager/Admin only)
 */
router.post(
  '/',
  authorize([STAFF_ROLES.ADMIN, STAFF_ROLES.MANAGER]),
  staffController.create
);

/**
 * @route   PUT /api/v1/staff/:id
 * @desc    Update staff
 * @access  Private (Manager/Admin only)
 */
router.put(
  '/:id',
  authorize([STAFF_ROLES.ADMIN, STAFF_ROLES.MANAGER]),
  staffController.update
);

/**
 * @route   PATCH /api/v1/staff/:id/status
 * @desc    Update staff status
 * @access  Private (Manager/Admin only)
 */
router.patch(
  '/:id/status',
  authorize([STAFF_ROLES.ADMIN, STAFF_ROLES.MANAGER]),
  staffController.updateStatus
);

/**
 * @route   PUT /api/v1/staff/:id/permissions
 * @desc    Update staff permissions
 * @access  Private (Manager/Admin only)
 */
router.put(
  '/:id/permissions',
  authorize([STAFF_ROLES.ADMIN, STAFF_ROLES.MANAGER]),
  staffController.updatePermissions
);

module.exports = router;
