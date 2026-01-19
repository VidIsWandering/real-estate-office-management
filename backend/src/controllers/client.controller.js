/**
 * Client Controller - Quản lý khách hàng
 */

const {
  successResponse,
  errorResponse,
  successResponseWithPagination,
} = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');
const clientService = require('../services/client.service');

class ClientController {
  /**
   * GET /clients
   */
  async getAll(req, res) {
    try {
      const result = await clientService.getAll(req.query, req.user);
      return successResponseWithPagination(
        res,
        result.items.map((c) => c.toJSON()),
        result.pagination,
        'Client list retrieved successfully'
      );
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  /**
   * GET /clients/:id
   */
  async getById(req, res) {
    const { id } = req.params;
    try {
      const result = await clientService.getById(id, req.user);
      return successResponse(
        res,
        { ...result },
        'Client retrieved successfully'
      );
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  /**
   * POST /clients
   */
  async create(req, res) {
    const rawClientData = req.body;

    const clientData = { ...rawClientData, staff_id: req.user.staff_id };

    try {
      const result = await clientService.create(clientData);
      return successResponse(
        res,
        { ...result },
        'Client created successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  /**
   * PUT /clients/:id
   */
  async update(req, res) {
    // TODO: Implement
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await clientService.update(id, updateData, req.user);
      return successResponse(res, { ...result }, 'Client updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  /**
   * DELETE /clients/:id
   */
  async delete(req, res) {
    // TODO: Implement (soft delete)
    try {
      const { id } = req.params;
      const result = await clientService.delete(id, req.user);
      return successResponse(
        res,
        { deleted: result },
        'Client deleted successfully'
      );
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  /**
   * GET /clients/:id/notes
   */
  async getNotes(req, res) {
    try {
      // TODO: Implement
      const { id } = req.params;
      const { from, to } = req.query;
      const query = { client_id: id, from, to };
      const result = await clientService.getNotes(query, req.user);
      return successResponseWithPagination(
        res,
        { client_id: id, notes: result.items },
        result.pagination,

        'Notes retrieved successfully'
      );
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  /**
   * POST /clients/:id/notes
   */
  async addNote(req, res) {
    try {
      // TODO: Implement
      const { id } = req.params;
      const { content } = req.body;
      const data = { client_id: id, staff_id: req.user.staff_id, content };
      const result = await clientService.addNote(data, req.user);
      return successResponse(
        res,
        { ...result },
        'Note added successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      return errorResponse(res, error.message);
    }
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
