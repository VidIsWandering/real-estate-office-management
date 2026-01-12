/**
 * Real Estate Controller - Quản lý bất động sản
 */

const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');
const { formatUploadedFiles } = require('../utils/file.utils');
const realEstateService = require('../services/real-estate.service');

class RealEstateController {
  /**
   * GET /real-estates
   */
  async getAll(req, res) {
    // TODO: Implement với realEstateService.getAll(req.query)
    const query = { limit: 10, page: 1, ...req.query };

    const result = await realEstateService.getRealEstates(query)

    return successResponse(
      res,
      {
        items: result,
        pagination: { page: Number(query.page), limit: Number(query.limit), total: 0 },
      },
      'Real estate list retrieved successfully'
    );
  }

  /**
   * GET /real-estates/:id
   */
  async getById(req, res) {
    // TODO: Implement
    const { id } = req.params;
    const result = await realEstateService.getRealEstateById(id)
    return successResponse(res, { ...result }, 'Real estate retrieved successfully');
  }

  /**
   * POST /real-estates
   */
  async create(req, res) {
    // TODO: Implement - Handle file uploads via req.files
    const media_files = formatUploadedFiles(req.files?.media_files)
    const legal_docs = formatUploadedFiles(req.files?.legal_docs)

    const data = { ...req.body, media_files, legal_docs, staff_id: req.user.staff_id }

    const result = await realEstateService.create(data)

    return successResponse(
      res,
      { ...result },
      'Real estate created successfully',
      HTTP_STATUS.CREATED
    );
  }

  /**
   * PUT /real-estates/:id
   */
  async update(req, res) {
    // TODO: Implement - Track price history if price changes
    const { id } = req.params;
    const media_files = formatUploadedFiles(req.files?.media_files)
    const legal_docs = formatUploadedFiles(req.files?.legal_docs)

    const data = { ...req.body, media_files, legal_docs, staff_id: req.user.staff_id }
    const result = await realEstateService.updateRealEstateById(id, data)
    return successResponse(
      res,
      { ...result },
      'Real estate updated successfully'
    );
  }

  /**
   * PUT /real-estates/:id/legal-check
   * Legal Officer kiểm tra pháp lý
   */
  async legalCheck(req, res) {
    // TODO: Implement - Update status to LISTED if approved
    const { id } = req.params;
    const { is_approved, note } = req.body;

    return successResponse(
      res,
      { id, is_approved, note, status: is_approved ? 'listed' : 'pending' },
      is_approved ? 'Legal check approved' : 'Legal check requires attention'
    );
  }

  /**
   * PATCH /real-estates/:id/status
   */
  async updateStatus(req, res) {
    // TODO: Implement
    const { id } = req.params;
    const { status, reason } = req.body;

    return successResponse(
      res,
      { id, status, reason },
      'Real estate status updated successfully'
    );
  }

  /**
   * GET /real-estates/:id/price-history
   */
  async getPriceHistory(req, res) {
    // TODO: Implement
    const { id } = req.params;
    return successResponse(
      res,
      { real_estate_id: id, history: [] },
      'Price history retrieved successfully'
    );
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
