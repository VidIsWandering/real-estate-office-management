/**
 * Staff Routes
 */

const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staff.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { STAFF_ROLES } = require('../config/constants');
const {
  validateStaffCreate,
  validateStaffUpdate,
  validateStaffStatusUpdate,
  validateStaffPermissionsUpdate,
  validateStaffId,
  validateStaffQuery,
} = require('../validators/staff.validator');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/staff
 * @desc    Get all staff with pagination and filters
 * @access  Private
 * @query   page, limit, position, status, search
 */
router.get('/', validateStaffQuery, staffController.getAll);

/**
 * @route   GET /api/v1/staff/:id
 * @desc    Get staff by ID
 * @access  Private
 */
router.get('/:id', validateStaffId, staffController.getById);

/**
 * @route   POST /api/v1/staff
 * @desc    Create new staff
 * @access  Private (Manager/Admin only)
 * @body    username, password, full_name, email, phone_number, address, assigned_area, position, status
 */
router.post(
  '/',
  authorize([STAFF_ROLES.ADMIN, STAFF_ROLES.MANAGER]),
  validateStaffCreate,
  staffController.create
);

/**
 * @route   PUT /api/v1/staff/:id
 * @desc    Update staff information
 * @access  Private (Manager/Admin only)
 * @body    full_name, email, phone_number, address, assigned_area, position, status
 */
router.put(
  '/:id',
  authorize([STAFF_ROLES.ADMIN, STAFF_ROLES.MANAGER]),
  validateStaffUpdate,
  staffController.update
);

/**
 * @route   PATCH /api/v1/staff/:id/status
 * @desc    Update staff status (working/off_duty)
 * @access  Private (Manager/Admin only)
 * @body    status
 */
router.patch(
  '/:id/status',
  authorize([STAFF_ROLES.ADMIN, STAFF_ROLES.MANAGER]),
  validateStaffStatusUpdate,
  staffController.updateStatus
);

/**
 * @route   PUT /api/v1/staff/:id/permissions
 * @desc    Update staff position/permissions
 * @access  Private (Admin only)
 * @body    position
 */
router.put(
  '/:id/permissions',
  authorize([STAFF_ROLES.ADMIN]),
  validateStaffPermissionsUpdate,
  staffController.updatePermissions
);

/**
 * @route   DELETE /api/v1/staff/:id
 * @desc    Delete staff (soft delete - set status to off_duty)
 * @access  Private (Admin/Manager only)
 */
router.delete(
  '/:id',
  authorize([STAFF_ROLES.ADMIN, STAFF_ROLES.MANAGER]),
  validateStaffId,
  staffController.delete
);

module.exports = router;
