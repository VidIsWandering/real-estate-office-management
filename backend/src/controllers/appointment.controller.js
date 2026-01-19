/**
 * Appointment Controller - Quản lý lịch hẹn
 */

const {
  successResponse,
  successResponseWithPagination,
  errorResponse,
} = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');
const appointmentService = require('../services/appointment.service');

class AppointmentController {
  /**
   * GET /appointments
   */
  async getAll(req, res) {
    try {
      // TODO: Implement - Agent: chỉ xem của mình, Manager: xem tất cả
      const { page = 1, limit = 10 } = req.query;
      const query = { ...req.query };

      const result = await appointmentService.getAll(
        { ...query, page: Number(page), limit: Number(limit) },
        req.user
      );

      return successResponseWithPagination(
        res,
        result.items,
        result.pagination,
        'Appointment list retrieved successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to retrieve appointment list',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /appointments/:id
   */
  async getById(req, res) {
    try {
      // TODO: Implement
      const { id } = req.params;
      const appointment = await appointmentService.getById(id, req.user);

      return successResponse(
        res,
        { ...appointment },
        'Appointment retrieved successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to retrieve appointment',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * POST /appointments
   */
  async create(req, res) {
    try {
      // TODO: Implement - Check schedule conflict
      const appointment = await appointmentService.create(req.body, req.user);

      return successResponse(
        res,
        { ...appointment },
        'Appointment created successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to create appointment',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * PUT /appointments/:id
   */
  async update(req, res) {
    try {
      // TODO: Implement
      const { id } = req.params;
      const appointment = await appointmentService.update(
        id,
        req.body,
        req.user
      );

      return successResponse(
        res,
        appointment,
        'Appointment updated successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to update appointment',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * PATCH /appointments/:id/status
   */
  async updateStatus(req, res) {
    try {
      // TODO: Implement - Validate status transition
      const { id } = req.params;
      const { status, result_note } = req.body;

      const appointment = await appointmentService.updateStatus(
        id,
        status,
        result_note,
        req.user
      );

      return successResponse(
        res,
        appointment,
        'Appointment status updated successfully'
      );
    } catch (error) {
      return errorResponse(
        res,
        error.message || 'Failed to update appointment status',
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
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
