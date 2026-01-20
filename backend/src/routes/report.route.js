// src/routes/report.routes.js

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  validateRevenueReport,
  validateAgentPerformance,
  validateDebtReport,
  validateRecentTransactions,
  validateTopProperties,
} = require('../validators/report.validator');

/**
 * Tất cả routes đều yêu cầu authentication
 */
router.use(authenticate);

/**
 * @route   GET /api/v1/reports/revenue
 * @desc    Lấy báo cáo doanh thu
 * @access  Manager, Accountant
 */
router.get(
  '/revenue',
  authorize('manager', 'accountant'),
  validateRevenueReport,
  reportController.getRevenueReport
);

/**
 * @route   GET /api/v1/reports/revenue/export
 * @desc    Export báo cáo doanh thu
 * @access  Manager, Accountant
 */
router.get(
  '/revenue/export',
  authorize('manager', 'accountant'),
  validateRevenueReport,
  reportController.exportRevenueReport
);

/**
 * @route   GET /api/v1/reports/agent-performance
 * @desc    Lấy báo cáo hiệu suất agent
 * @access  Manager
 */
router.get(
  '/agent-performance',
  authorize('manager'),
  validateAgentPerformance,
  reportController.getAgentPerformanceReport
);

/**
 * @route   GET /api/v1/reports/agent-performance/export
 * @desc    Export báo cáo hiệu suất agent
 * @access  Manager
 */
router.get(
  '/agent-performance/export',
  authorize('manager'),
  validateAgentPerformance,
  reportController.exportAgentPerformanceReport
);

/**
 * @route   GET /api/v1/reports/debt
 * @desc    Lấy báo cáo công nợ
 * @access  Manager, Accountant
 */
router.get(
  '/debt',
  authorize('manager', 'accountant'),
  validateDebtReport,
  reportController.getDebtReport
);

/**
 * @route   GET /api/v1/reports/debt/export
 * @desc    Export báo cáo công nợ
 * @access  Manager, Accountant
 */
router.get(
  '/debt/export',
  authorize('manager', 'accountant'),
  validateDebtReport,
  reportController.exportDebtReport
);

/**
 * Dashboard routes - accessible by all authenticated users
 */

/**
 * @route   GET /api/v1/reports/dashboard/stats
 * @desc    Lấy thống kê dashboard
 * @access  All authenticated
 */
router.get('/dashboard/stats', reportController.getDashboardStats);

/**
 * @route   GET /api/v1/reports/dashboard/recent-transactions
 * @desc    Lấy giao dịch gần đây
 * @access  All authenticated
 */
router.get(
  '/dashboard/recent-transactions',
  validateRecentTransactions,
  reportController.getRecentTransactions
);

/**
 * @route   GET /api/v1/reports/dashboard/top-properties
 * @desc    Lấy top BĐS giá trị cao
 * @access  All authenticated
 */
router.get(
  '/dashboard/top-properties',
  validateTopProperties,
  reportController.getTopProperties
);

/**
 * @route   GET /api/v1/reports/dashboard/agent-performance-chart
 * @desc    Lấy dữ liệu biểu đồ hiệu suất agent
 * @access  All authenticated
 */
router.get(
  '/dashboard/agent-performance-chart',
  reportController.getAgentPerformanceChart
);

/**
 * @route   GET /api/v1/reports/dashboard/property-sales-chart
 * @desc    Lấy dữ liệu biểu đồ BĐS theo loại
 * @access  All authenticated
 */
router.get(
  '/dashboard/property-sales-chart',
  reportController.getPropertySalesChart
);

module.exports = router;
