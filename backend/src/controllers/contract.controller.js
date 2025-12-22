/**
 * Contract Controller - Quản lý hợp đồng
 */

const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

class ContractController {
  /**
   * GET /contracts
   */
  async getAll(req, res) {
    const { page = 1, limit = 10 } = req.query;

    return successResponse(
      res,
      {
        items: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      },
      'Contract list retrieved successfully'
    );
  }

  /**
   * GET /contracts/:id
   */
  async getById(req, res) {
    const { id } = req.params;
    return successResponse(res, { id }, 'Contract retrieved successfully');
  }

  /**
   * POST /contracts
   * Chỉ Legal Officer có quyền
   */
  async create(req, res) {
    // TODO: Implement - Calculate remaining_amount = total_value - deposit_amount
    const { total_value, deposit_amount = 0 } = req.body;

    return successResponse(
      res,
      {
        ...req.body,
        staff_id: req.user.staff_id,
        status: 'draft',
        paid_amount: 0,
        remaining_amount: total_value - deposit_amount,
      },
      'Contract created successfully',
      HTTP_STATUS.CREATED
    );
  }

  /**
   * PUT /contracts/:id
   */
  async update(req, res) {
    // TODO: Implement - Only allow when status = DRAFT
    const { id } = req.params;
    return successResponse(
      res,
      { id, ...req.body },
      'Contract updated successfully'
    );
  }

  /**
   * PATCH /contracts/:id/status
   */
  async updateStatus(req, res) {
    // TODO: Implement - Validate status transition workflow
    const { id } = req.params;
    const { status, signed_date, cancellation_reason } = req.body;

    return successResponse(
      res,
      { id, status, signed_date, cancellation_reason },
      'Contract status updated successfully'
    );
  }

  /**
   * POST /contracts/:id/files
   */
  async uploadFiles(req, res) {
    // TODO: Implement - Handle file uploads
    const { id } = req.params;

    return successResponse(
      res,
      { contract_id: id, files: [] },
      'Files uploaded successfully'
    );
  }

  /**
   * GET /contracts/:id/files
   */
  async getFiles(req, res) {
    const { id } = req.params;
    return successResponse(
      res,
      { contract_id: id, files: [] },
      'Files retrieved successfully'
    );
  }
}

const controller = new ContractController();

module.exports = {
  getAll: asyncHandler((req, res) => controller.getAll(req, res)),
  getById: asyncHandler((req, res) => controller.getById(req, res)),
  create: asyncHandler((req, res) => controller.create(req, res)),
  update: asyncHandler((req, res) => controller.update(req, res)),
  updateStatus: asyncHandler((req, res) => controller.updateStatus(req, res)),
  uploadFiles: asyncHandler((req, res) => controller.uploadFiles(req, res)),
  getFiles: asyncHandler((req, res) => controller.getFiles(req, res)),
};
