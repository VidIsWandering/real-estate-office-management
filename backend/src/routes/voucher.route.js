// src/routes/voucher.routes.js

const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucher.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  validateListVouchers,
  validateCreateVoucher,
  validateUpdateVoucher,
  validateStats,
  validateIdParam,
  validateContractIdParam
} = require('../validators/voucher.validator');

/**
 * Tất cả routes đều yêu cầu authentication
 */
router.use(authenticate);

/**
 * Tất cả routes chỉ cho phép manager và accountant
 */
router.use(authorize('manager', 'accountant'));

/**
 * @route   GET /api/v1/vouchers/stats
 * @desc    Lấy thống kê vouchers
 * @access  Manager, Accountant
 */
router.get(
  '/stats',
  validateStats,
  voucherController.getStats
);

/**
 * @route   GET /api/v1/vouchers/by-contract/:contractId
 * @desc    Lấy vouchers theo contract
 * @access  Manager, Accountant
 */
router.get(
  '/by-contract/:contractId',
  validateContractIdParam,
  voucherController.getVouchersByContract
);

/**
 * @route   GET /api/v1/vouchers
 * @desc    Lấy danh sách vouchers
 * @access  Manager, Accountant
 */
router.get(
  '/',
  validateListVouchers,
  voucherController.getVouchers
);

/**
 * @route   GET /api/v1/vouchers/:id
 * @desc    Lấy chi tiết voucher
 * @access  Manager, Accountant
 */
router.get(
  '/:id',
  validateIdParam,
  voucherController.getVoucherById
);

/**
 * @route   POST /api/v1/vouchers
 * @desc    Tạo voucher mới
 * @access  Manager, Accountant
 */
router.post(
  '/',
  validateCreateVoucher,
  voucherController.createVoucher
);

/**
 * @route   PUT /api/v1/vouchers/:id
 * @desc    Cập nhật voucher
 * @access  Manager, Accountant
 */
router.put(
  '/:id',
  validateIdParam,
  validateUpdateVoucher,
  voucherController.updateVoucher
);

/**
 * @route   DELETE /api/v1/vouchers/:id
 * @desc    Xóa voucher
 * @access  Manager only
 */
router.delete(
  '/:id',
  authorize('manager'), // Override to manager only
  validateIdParam,
  voucherController.deleteVoucher
);

/**
 * @route   PATCH /api/v1/vouchers/:id/confirm
 * @desc    Xác nhận voucher
 * @access  Manager, Accountant
 */
router.patch(
  '/:id/confirm',
  validateIdParam,
  voucherController.confirmVoucher
);

/**
 * @route   POST /api/v1/vouchers/:id/attachments
 * @desc    Thêm attachments cho voucher
 * @access  Manager, Accountant
 */
router.post(
  '/:id/attachments',
  validateIdParam,
  voucherController.addAttachments
);

module.exports = router;
