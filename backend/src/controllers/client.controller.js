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
const staffRepository = require('../repositories/staff.repository');

class ClientController {
  /**
   * GET /clients/options
   * Lightweight lookup for dropdowns (owners, etc.)
   */
  async getOptions(req, res) {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const search =
        typeof req.query.search === 'string' ? req.query.search : '';

      const query = {
        page,
        limit,
        full_name: search || undefined,
      };

      const result = await clientService.getOptions(query);
      return successResponseWithPagination(
        res,
        result.items,
        result.pagination,
        'Client options retrieved successfully'
      );
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

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
      const updatedClient = result?.updated_client ?? result?.client ?? result;
      return successResponse(res, updatedClient, 'Client updated successfully');
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
      const { id } = req.params;
      const { from, to, page, limit } = req.query;
      const query = {
        client_id: id,
        from,
        to,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      };
      const result = await clientService.getNotes(query, req.user);

      const staffIds = Array.from(
        new Set(
          result.items
            .map((note) => note.staff_id)
            .filter((staffId) => staffId !== null && staffId !== undefined)
        )
      );

      const staffNameById = new Map();
      await Promise.all(
        staffIds.map(async (staffId) => {
          const staff = await staffRepository.findById(staffId);
          if (staff) {
            staffNameById.set(String(staffId), staff.full_name);
          }
        })
      );

      const notes = result.items.map((note) => ({
        id:
          note.id !== undefined && note.id !== null
            ? Number(note.id)
            : undefined,
        content: note.content,
        created_at: note.created_at,
        created_by:
          note.staff_id !== undefined && note.staff_id !== null
            ? Number(note.staff_id)
            : undefined,
        created_by_name: staffNameById.get(String(note.staff_id)) ?? null,
      }));

      return successResponseWithPagination(
        res,
        notes,
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
      const { id } = req.params;
      const { content } = req.body;
      const data = { client_id: id, staff_id: req.user.staff_id, content };
      const result = await clientService.addNote(data, req.user);

      const note = result?.client_note;
      const staff = result?.staff;

      return successResponse(
        res,
        {
          id:
            note?.id !== undefined && note?.id !== null
              ? Number(note.id)
              : undefined,
          content: note?.content,
          created_at: note?.created_at,
          created_by:
            note?.staff_id !== undefined && note?.staff_id !== null
              ? Number(note.staff_id)
              : undefined,
          created_by_name: staff?.full_name ?? null,
        },
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
  getOptions: asyncHandler((req, res) => controller.getOptions(req, res)),
  getAll: asyncHandler((req, res) => controller.getAll(req, res)),
  getById: asyncHandler((req, res) => controller.getById(req, res)),
  create: asyncHandler((req, res) => controller.create(req, res)),
  update: asyncHandler((req, res) => controller.update(req, res)),
  delete: asyncHandler((req, res) => controller.delete(req, res)),
  getNotes: asyncHandler((req, res) => controller.getNotes(req, res)),
  addNote: asyncHandler((req, res) => controller.addNote(req, res)),
};
