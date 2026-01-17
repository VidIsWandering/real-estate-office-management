/**
 * Report Routes
 */

const express = require('express');
const router = express.Router();

const reportController = require('../controllers/report.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { STAFF_ROLES } = require('../config/constants');

// All routes require authentication
router.use(authenticate);

// All report routes require Manager/Admin role
router.use(authorize([STAFF_ROLES.MANAGER, STAFF_ROLES.ADMIN]));

/**
 * @route   GET /api/v1/reports/revenue
 * @desc    Get revenue report
 * @access  Private (Manager/Admin only)
 */
router.get('/revenue', reportController.getRevenue);

/**
 * @route   GET /api/v1/reports/performance
 * @desc    Get agent performance report
 * @access  Private (Manager/Admin only)
 */
router.get('/performance', reportController.getPerformance);

/**
 * @route   GET /api/v1/reports/real-estate-status
 * @desc    Get real estate status report
 * @access  Private (Manager/Admin only)
 */
router.get('/real-estate-status', reportController.getRealEstateStatus);

/**
 * @route   GET /api/v1/reports/financial
 * @desc    Get financial report
 * @access  Private (Manager/Admin only)
 */
router.get('/financial', reportController.getFinancial);

module.exports = router;
