// src/controllers/voucher.controller.js

const voucherService = require('../services/voucher.service');
const auditService = require('../services/audit.service');

class VoucherController {
  /**
   * GET /api/v1/vouchers
   * Lấy danh sách vouchers
   */
  async getVouchers(req, res, next) {
    try {
      const filters = {
        contractId: req.query.contractId
          ? parseInt(req.query.contractId)
          : null,
        type: req.query.type || null,
        status: req.query.status || null,
        paymentMethod: req.query.paymentMethod || null,
        fromDate: req.query.fromDate || null,
        toDate: req.query.toDate || null,
        search: req.query.search || null,
        sortBy: req.query.sortBy || 'created_at',
        sortOrder: req.query.sortOrder || 'desc',
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      };

      const data = await voucherService.getVouchers(filters);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/vouchers/:id
   * Lấy chi tiết voucher
   */
  async getVoucherById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const data = await voucherService.getVoucherById(id);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/vouchers
   * Tạo voucher mới
   */
  async createVoucher(req, res, next) {
    try {
      console.log('req.user:', req.user); // ← Thêm dòng này
      const staffId = req.user.staff_id;
      const data = await voucherService.createVoucher(req.body, staffId);

      // Audit log
      await auditService.log({
        actorId: req.user.staff_id,
        actionType: 'create',
        targetType: 'voucher',
        targetId: data.id,
        details: {
          type: req.body.type,
          amount: req.body.amount,
          contractId: req.body.contractId,
        },
        ipAddress: req.ip,
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/vouchers/:id
   * Cập nhật voucher
   */
  async updateVoucher(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const data = await voucherService.updateVoucher(id, req.body);

      // Audit log
      await auditService.log({
        actorId: req.user.staff_id,
        actionType: 'update',
        targetType: 'voucher',
        targetId: id,
        details: req.body,
        ipAddress: req.ip,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/vouchers/:id
   * Xóa voucher
   */
  async deleteVoucher(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const data = await voucherService.deleteVoucher(id);

      // Audit log
      await auditService.log({
        actorId: req.user.staff_id,
        actionType: 'delete',
        targetType: 'voucher',
        targetId: id,
        details: {},
        ipAddress: req.ip,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/vouchers/:id/confirm
   * Xác nhận voucher
   */
  async confirmVoucher(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const data = await voucherService.confirmVoucher(id);

      // Audit log
      await auditService.log({
        actorId: req.user.staff_id,
        actionType: 'status_change',
        targetType: 'voucher',
        targetId: id,
        details: { from: 'created', to: 'confirmed' },
        ipAddress: req.ip,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/vouchers/stats
   * Lấy thống kê vouchers
   */
  async getStats(req, res, next) {
    try {
      const filters = {
        fromDate: req.query.fromDate || null,
        toDate: req.query.toDate || null,
        contractId: req.query.contractId
          ? parseInt(req.query.contractId)
          : null,
      };

      const data = await voucherService.getStats(filters);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/vouchers/by-contract/:contractId
   * Lấy vouchers theo contract
   */
  async getVouchersByContract(req, res, next) {
    try {
      const contractId = parseInt(req.params.contractId);
      const data = await voucherService.getVouchersByContract(contractId);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/vouchers/:id/attachments
   * Upload attachments cho voucher
   */
  async addAttachments(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const fileIds = req.body.fileIds || [];

      const data = await voucherService.addAttachments(id, fileIds);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VoucherController();
