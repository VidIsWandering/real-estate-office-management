/**
 * Voucher Controller - Quản lý chứng từ thu chi
 */

const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

class VoucherController {
  /**
   * GET /vouchers
   */
  async getAll(req, res) {
    const { page = 1, limit = 10 } = req.query;

    return successResponse(
      res,
      {
        items: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      },
      'Voucher list retrieved successfully'
    );
  }

  /**
   * GET /vouchers/:id
   */
  async getById(req, res) {
    const { id } = req.params;
    return successResponse(res, { id }, 'Voucher retrieved successfully');
  }

  /**
   * POST /vouchers
   */
  async create(req, res) {
    // TODO: Implement - If contract_id, update paid_amount in Contract
    return successResponse(
      res,
      { ...req.body, staff_id: req.user.staff_id, status: 'created' },
      'Voucher created successfully',
      HTTP_STATUS.CREATED
    );
  }

  /**
   * PUT /vouchers/:id
   */
  async update(req, res) {
    // TODO: Implement - Only allow when status = CREATED
    const { id } = req.params;
    return successResponse(
      res,
      { id, ...req.body },
      'Voucher updated successfully'
    );
  }

  /**
   * PATCH /vouchers/:id/confirm
   */
  async confirm(req, res) {
    // TODO: Implement - Update status to CONFIRMED
    const { id } = req.params;

    return successResponse(
      res,
      { id, status: 'confirmed' },
      'Voucher confirmed successfully'
    );
  }

  /**
   * GET /debts
   * Lấy danh sách công nợ (contracts với remaining_amount > 0)
   */
  async getDebts(req, res) {
    const { page = 1, limit = 10 } = req.query;

    return successResponse(
      res,
      {
        items: [],
        summary: { total_debt: 0, count: 0 },
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      },
      'Debts retrieved successfully'
    );
  }
}

const controller = new VoucherController();

module.exports = {
  getAll: asyncHandler((req, res) => controller.getAll(req, res)),
  getById: asyncHandler((req, res) => controller.getById(req, res)),
  create: asyncHandler((req, res) => controller.create(req, res)),
  update: asyncHandler((req, res) => controller.update(req, res)),
  confirm: asyncHandler((req, res) => controller.confirm(req, res)),
  getDebts: asyncHandler((req, res) => controller.getDebts(req, res)),
};
