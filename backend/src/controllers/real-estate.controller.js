/**
 * Real Estate Controller - Quản lý bất động sản
 */

const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

class RealEstateController {
  /**
   * GET /real-estates
   */
  async getAll(req, res) {
    // TODO: Implement với realEstateService.getAll(req.query)
    const { page = 1, limit = 10 } = req.query;

    return successResponse(
      res,
      {
        items: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
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
    return successResponse(res, { id }, 'Real estate retrieved successfully');
  }

  /**
   * POST /real-estates
   */
  async create(req, res) {
    // TODO: Implement - Handle file uploads via req.files
    return successResponse(
      res,
      { ...req.body, staff_id: req.user.staff_id, status: 'created' },
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
    return successResponse(
      res,
      { id, ...req.body },
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
