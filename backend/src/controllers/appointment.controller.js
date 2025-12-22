/**
 * Appointment Controller - Quản lý lịch hẹn
 */

const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

class AppointmentController {
  /**
   * GET /appointments
   */
  async getAll(req, res) {
    // TODO: Implement - Agent: chỉ xem của mình, Manager: xem tất cả
    const { page = 1, limit = 10 } = req.query;

    return successResponse(
      res,
      {
        items: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      },
      'Appointment list retrieved successfully'
    );
  }

  /**
   * GET /appointments/:id
   */
  async getById(req, res) {
    // TODO: Implement
    const { id } = req.params;
    return successResponse(res, { id }, 'Appointment retrieved successfully');
  }

  /**
   * POST /appointments
   */
  async create(req, res) {
    // TODO: Implement - Check schedule conflict
    return successResponse(
      res,
      { ...req.body, staff_id: req.user.staff_id, status: 'created' },
      'Appointment created successfully',
      HTTP_STATUS.CREATED
    );
  }

  /**
   * PUT /appointments/:id
   */
  async update(req, res) {
    // TODO: Implement
    const { id } = req.params;
    return successResponse(
      res,
      { id, ...req.body },
      'Appointment updated successfully'
    );
  }

  /**
   * PATCH /appointments/:id/status
   */
  async updateStatus(req, res) {
    // TODO: Implement - Validate status transition
    const { id } = req.params;
    const { status, result_note } = req.body;

    return successResponse(
      res,
      { id, status, result_note },
      'Appointment status updated successfully'
    );
  }
}

const controller = new AppointmentController();

module.exports = {
  getAll: asyncHandler((req, res) => controller.getAll(req, res)),
  getById: asyncHandler((req, res) => controller.getById(req, res)),
  create: asyncHandler((req, res) => controller.create(req, res)),
  update: asyncHandler((req, res) => controller.update(req, res)),
  updateStatus: asyncHandler((req, res) => controller.updateStatus(req, res)),
};
