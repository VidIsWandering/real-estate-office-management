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

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Client list retrieved successfully',
      data: result.items,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: Math.ceil(result.pagination.total / result.pagination.limit),
      },
    });
  }

  /**
   * GET /clients/:id
   */
  async getById(req, res) {
    const { id } = req.params;
    const client = await clientService.getById(id);
    return successResponse(res, client, 'Client retrieved successfully');
  }

  /**
   * POST /clients
   */
  async create(req, res) {
    const client = await clientService.create(req.body, req.user);
    return successResponse(res, client, 'Client created successfully', HTTP_STATUS.CREATED);
  }

  /**
   * PUT /clients/:id
   */
  async update(req, res) {
    const { id } = req.params;
    const client = await clientService.update(id, req.body, req.user);
    return successResponse(res, client, 'Client updated successfully');
  }

  /**
   * DELETE /clients/:id
   */
  async delete(req, res) {
    const { id } = req.params;
    const client = await clientService.delete(id);
    return successResponse(res, client, 'Client deleted successfully');
  }

  /**
   * GET /clients/:id/notes
   */
  async getNotes(req, res) {
    const { id } = req.params;
    const result = await clientService.getNotes(id, req.query);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Notes retrieved successfully',
      data: result.items,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: Math.ceil(result.pagination.total / result.pagination.limit),
      },
    });
  }

  /**
   * POST /clients/:id/notes
   */
  async addNote(req, res) {
    const { id } = req.params;
    const note = await clientService.addNote(id, req.body, req.user);
    return successResponse(res, note, 'Note added successfully', HTTP_STATUS.CREATED);
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
