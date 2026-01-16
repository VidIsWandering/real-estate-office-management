/**
 * Real Estate Controller - Quản lý bất động sản
 */

const {
  successResponse,
  successResponseWithPagination,
  errorResponse,
} = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');
const { formatUploadedFiles } = require('../utils/file.utils');
const realEstateService = require('../services/real-estate.service');

class RealEstateController {
  /**
   * GET /real-estates
   */
  async getAll(req, res) {
    try {
      const query = { limit: 10, page: 1, ...req.query };

      const result = await realEstateService.getRealEstates(query, req.user);

      return successResponseWithPagination(
        res,
        result.items,
        result.pagination,
        'Real estate list retrieved successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to retrieve real estate list',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /real-estates/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const result = await realEstateService.getRealEstateById(id, req.user);

      return successResponse(
        res,
        { ...result },
        'Real estate retrieved successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to retrieve real estate',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * POST /real-estates
   */
  async create(req, res) {
    try {
      const media_files = formatUploadedFiles(req.files?.media_files);
      const legal_docs = formatUploadedFiles(req.files?.legal_docs);

      const data = {
        ...req.body,
        media_files,
        legal_docs,
        staff_id: req.user.staff_id,
      };

      const result = await realEstateService.create(data, req.user);

      return successResponse(
        res,
        { ...result },
        'Real estate created successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to create real estate',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * PUT /real-estates/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;

      const media_files = formatUploadedFiles(req.files?.media_files);
      const legal_docs = formatUploadedFiles(req.files?.legal_docs);

      const data = { ...req.body, media_files, legal_docs };

      const result = await realEstateService.updateRealEstateById(
        id,
        data,
        req.user
      );

      return successResponse(
        res,
        { ...result },
        'Real estate updated successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to update real estate',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * PUT /real-estates/:id/legal-check
   * Legal Officer kiểm tra pháp lý
   */
  async legalCheck(req, res) {
    try {
      const { id } = req.params;
      const { is_approved, note } = req.body;

      const updatedRealEstate = is_approved
        ? await realEstateService.legalCheck(
            Number(id),
            req.user.id,
            note
          )
        : await realEstateService.updateStatus(
            Number(id),
            'pending_legal_check',
            req.user.id,
            note
          );

      return successResponse(
        res,
        {
          id: updatedRealEstate.id,
          status: updatedRealEstate.status,
          note,
        },
        is_approved
          ? 'Legal check approved'
          : 'Legal check requires attention'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Legal check failed',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * PATCH /real-estates/:id/status
   */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      const updatedRealEstate = await realEstateService.updateStatus(
       id,
        status,
        req.user,
        reason
      );

      return successResponse(
        res,
        {
          id: updatedRealEstate.id,
          status: updatedRealEstate.status,
          reason,
        },
        'Real estate status updated successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to update real estate status',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /real-estates/:id/price-history
   */
  async getPriceHistory(req, res) {
    try {
      const { id } = req.params;

      const history = await realEstateService.getPriceHistory(id, req.user);

      return successResponse(
        res,
        { real_estate_id: id, history },
        'Price history retrieved successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to retrieve price history',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

const controller = new RealEstateController();

module.exports = {
  getAll: asyncHandler((req, res) => controller.getAll(req, res)),
  getById: asyncHandler((req, res) => controller.getById(req, res)),
  create: asyncHandler((req, res) => controller.create(req, res)),
  update: asyncHandler((req, res) => controller.update(req, res)),
  legalCheck: asyncHandler((req, res) => controller.legalCheck(req, res)),
  updateStatus: asyncHandler((req, res) => controller.updateStatus(req, res)),
  getPriceHistory: asyncHandler((req, res) =>
    controller.getPriceHistory(req, res)
  ),
};
