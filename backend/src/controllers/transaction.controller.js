/**
 * Transaction Controller - Quản lý giao dịch
 */

const {
  successResponse,
  errorResponse,
  successResponseWithPagination,
} = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');
const transactionService = require('../services/transaction.service');

class TransactionController {
  /**
   * GET /transactions
   */
  async getAll(req, res) {
    try {
      const result = await transactionService.getAll(req.query, req.user);

      return successResponseWithPagination(
        res,

        result.items,
        result.pagination,
        'Transaction list retrieved successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to retrieve transaction list',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /transactions/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await transactionService.getById(id, req.user);

      return successResponse(
        res,
        { ...result },
        'Transaction retrieved successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to retrieve transaction',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * POST /transactions
   * Precondition: Client phải có lịch hẹn COMPLETED cho BĐS này
   */
  async create(req, res) {
    try {
      // TODO: Implement - Check precondition, update real estate status to NEGOTIATING
      const transaction = await transactionService.create(req.body, req.user);

      return successResponse(
        res,
        { ...transaction },
        'Transaction created successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to create transaction',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * PUT /transactions/:id
   */
  async update(req, res) {
    try {
      // TODO: Implement - Only allow when status = NEGOTIATING
      const transaction = await transactionService.update(
        req.params.id,
        req.body
      );

      return successResponse(
        res,
        { ...transaction },
        'Transaction updated successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to update transaction',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * PUT /transactions/:id/finalize
   * Hoàn tất đàm phán, chuyển sang giai đoạn hợp đồng
   */
  async finalize(req, res) {
    try {
      // TODO: Implement - Update status to PENDING, notify Legal Officer
      const { id } = req.params;
      const result = await transactionService.finalize(id);

      return successResponse(
        res,
        { ...result },
        'Transaction finalized successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to finalize transaction',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * PUT /transactions/:id/cancel
   */
  async cancel(req, res) {
    try {
      // TODO: Implement - Update status to CANCELLED, real estate back to LISTED
      const { id } = req.params;
      const { reason } = req.body;
      const result = await transactionService.cancel(id, reason, req.user);

      return successResponse(
        res,
        { ...result },
        'Transaction cancelled successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to cancel transaction',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
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
