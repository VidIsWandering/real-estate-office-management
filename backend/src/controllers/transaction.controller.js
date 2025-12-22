/**
 * Transaction Controller - Quản lý giao dịch
 */

const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

class TransactionController {
  /**
   * GET /transactions
   */
  async getAll(req, res) {
    const { page = 1, limit = 10 } = req.query;

    return successResponse(
      res,
      {
        items: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      },
      'Transaction list retrieved successfully'
    );
  }

  /**
   * GET /transactions/:id
   */
  async getById(req, res) {
    const { id } = req.params;
    return successResponse(res, { id }, 'Transaction retrieved successfully');
  }

  /**
   * POST /transactions
   * Precondition: Client phải có lịch hẹn COMPLETED cho BĐS này
   */
  async create(req, res) {
    // TODO: Implement - Check precondition, update real estate status to NEGOTIATING
    return successResponse(
      res,
      { ...req.body, staff_id: req.user.staff_id, status: 'negotiating' },
      'Transaction created successfully',
      HTTP_STATUS.CREATED
    );
  }

  /**
   * PUT /transactions/:id
   */
  async update(req, res) {
    // TODO: Implement - Only allow when status = NEGOTIATING
    const { id } = req.params;
    return successResponse(
      res,
      { id, ...req.body },
      'Transaction updated successfully'
    );
  }

  /**
   * PUT /transactions/:id/finalize
   * Hoàn tất đàm phán, chuyển sang giai đoạn hợp đồng
   */
  async finalize(req, res) {
    // TODO: Implement - Update status to PENDING, notify Legal Officer
    const { id } = req.params;
    return successResponse(
      res,
      { id, status: 'pending', ...req.body },
      'Transaction finalized successfully'
    );
  }

  /**
   * PUT /transactions/:id/cancel
   */
  async cancel(req, res) {
    // TODO: Implement - Update status to CANCELLED, real estate back to LISTED
    const { id } = req.params;
    const { reason } = req.body;

    return successResponse(
      res,
      { id, status: 'cancelled', cancellation_reason: reason },
      'Transaction cancelled successfully'
    );
  }
}

const controller = new TransactionController();

module.exports = {
  getAll: asyncHandler((req, res) => controller.getAll(req, res)),
  getById: asyncHandler((req, res) => controller.getById(req, res)),
  create: asyncHandler((req, res) => controller.create(req, res)),
  update: asyncHandler((req, res) => controller.update(req, res)),
  finalize: asyncHandler((req, res) => controller.finalize(req, res)),
  cancel: asyncHandler((req, res) => controller.cancel(req, res)),
};
