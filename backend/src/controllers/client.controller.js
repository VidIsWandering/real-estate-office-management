/**
 * Client Controller - Quản lý khách hàng
 */

const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');
const clientService = require('../services/client.service');

class ClientController {
  /**
   * GET /clients
   */
  async getAll(req, res) {
    const result = await clientService.getAll(req.query);

    return successResponse(
      res,
      {
        items: result.items.map(c => c.toJSON()),
        pagination: result.pagination,
      },
      'Client list retrieved successfully'
    );
  }


  /**
   * GET /clients/:id
   */
  async getById(req, res) {
    const { id } = req.params;
    const result = await clientService.getById(id)
    return successResponse(res, { ...result }, 'Client retrieved successfully');
  }

  /**
   * POST /clients
   */
  async create(req, res) {
    const rawClientData = req.body;

    const clientData = { ...rawClientData, staff_id: req.user.staff_id }

    const result = await clientService.create(clientData)
    return successResponse(
      res,
      { ...result },
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
    const updateData = req.body;
    const result = await clientService.update(id, updateData)
    return successResponse(
      res,
      { ...result },
      'Client updated successfully'
    );
  }

  /**
   * DELETE /clients/:id
   */
  async delete(req, res) {
    // TODO: Implement (soft delete)
    const { id } = req.params;
    const result = await clientService.delete(id)
    return successResponse(res, { deleted: result }, 'Client deleted successfully');
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
