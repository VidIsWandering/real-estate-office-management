/**
 * Client Controller - Quản lý khách hàng
 */

const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

class ClientController {
  /**
   * GET /clients
   */
  async getAll(req, res) {
    // TODO: Implement với clientService.getAll(req.query)
    const { page = 1, limit = 10 } = req.query;

    return successResponse(
      res,
      {
        items: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      },
      'Client list retrieved successfully'
    );
  }

  /**
   * GET /clients/:id
   */
  async getById(req, res) {
    // TODO: Implement
    const { id } = req.params;
    return successResponse(res, { id }, 'Client retrieved successfully');
  }

  /**
   * POST /clients
   */
  async create(req, res) {
    // TODO: Implement
    return successResponse(
      res,
      { ...req.body, staff_id: req.user.staff_id },
      'Client created successfully',
      HTTP_STATUS.CREATED
    );
  }

  /**
   * PUT /clients/:id
   */
  async update(req, res) {
    // TODO: Implement
    const { id } = req.params;
    return successResponse(
      res,
      { id, ...req.body },
      'Client updated successfully'
    );
  }

  /**
   * DELETE /clients/:id
   */
  async delete(req, res) {
    // TODO: Implement (soft delete)
    const { id } = req.params;
    return successResponse(res, { id }, 'Client deleted successfully');
  }

  /**
   * GET /clients/:id/notes
   */
  async getNotes(req, res) {
    // TODO: Implement
    const { id } = req.params;
    return successResponse(
      res,
      { client_id: id, notes: [] },
      'Notes retrieved successfully'
    );
  }

  /**
   * POST /clients/:id/notes
   */
  async addNote(req, res) {
    // TODO: Implement
    const { id } = req.params;
    return successResponse(
      res,
      { client_id: id, ...req.body },
      'Note added successfully',
      HTTP_STATUS.CREATED
    );
  }
}

const controller = new ClientController();

module.exports = {
  getAll: asyncHandler((req, res) => controller.getAll(req, res)),
  getById: asyncHandler((req, res) => controller.getById(req, res)),
  create: asyncHandler((req, res) => controller.create(req, res)),
  update: asyncHandler((req, res) => controller.update(req, res)),
  delete: asyncHandler((req, res) => controller.delete(req, res)),
  getNotes: asyncHandler((req, res) => controller.getNotes(req, res)),
  addNote: asyncHandler((req, res) => controller.addNote(req, res)),
};
