/**
 * Contract Controller - Quản lý hợp đồng
 */

const {
  successResponse,
  errorResponse,
  successResponseWithPagination,
} = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');
const contractService = require('../services/contract.service');
const { formatUploadedFiles } = require('../utils/file.utils');

class ContractController {
  /**
   * GET /contracts
   */
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await contractService.getAll(req.query);

      return successResponseWithPagination(
        res,

        result.items,
        result.pagination,

        'Contract list retrieved successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to retrieve contract list',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /contracts/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await contractService.getById(id);
      return successResponse(res, result, 'Contract retrieved successfully');
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to retrieve contract',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * POST /contracts
   * Chỉ Legal Officer có quyền
   */
  async create(req, res) {
    try {
      // TODO: Implement - Calculate remaining_amount = total_value - deposit_amount
      const result = await contractService.create(req.body, req.user);
      return successResponse(
        res,
        result,
        'Contract created successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to create contract',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * PUT /contracts/:id
   */
  async update(req, res) {
    try {
      // TODO: Implement - Only allow when status = DRAFT
      const result = await contractService.update(req.params.id, req.body);
      return successResponse(
        res,
        { ...result },
        'Contract updated successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to update contract',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * PATCH /contracts/:id/status
   */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;

      const updatedContract = await contractService.updateStatus(id, req.body);

      return successResponse(
        res,
        updatedContract,
        'Contract status updated successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to update contract status',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * POST /contracts/:id/files
   */
  async uploadFiles(req, res) {
    try {
      // TODO: Implement - Handle file uploads
      const { id } = req.params;

      const attachments = formatUploadedFiles(req.files?.attachments);
      console.log(attachments);

      const result = await contractService.addAttachments(id, attachments);
      return successResponse(res, { ...result }, 'Files uploaded successfully');
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to upload contract files',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /contracts/:id/files
   */
  async getFiles(req, res) {
    try {
      const { id } = req.params;
      const result = await contractService.getAttachments(id);
      return successResponse(
        res,
        { ...result },
        'Files retrieved successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to retrieve contract files',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
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
