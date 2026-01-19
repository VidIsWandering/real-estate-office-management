/**
 * Staff Controller - Handles HTTP requests for staff management
 */

const staffService = require('../services/staff.service');
const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');
const staffService = require('../services/staff.service');

class StaffController {
  /**
   * GET /staff
   * Get list of staff with pagination and filters
   */
  async getAll(req, res) {
    const result = await staffService.getAll(req.query, req.user?.position);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Staff list retrieved successfully',
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
   * GET /staff/:id
   * Get staff details by ID
   */
  async getById(req, res) {
    const { id } = req.params;
    const staff = await staffService.getById(id, req.user?.position);
    return successResponse(res, staff, 'Staff retrieved successfully');
  }

  /**
   * POST /staff
   * Create new staff member
   */
  async create(req, res) {
    const staff = await staffService.create(req.body);
    return successResponse(res, staff, 'Staff created successfully', HTTP_STATUS.CREATED);
  }

  /**
   * PUT /staff/:id
   * Update staff information
   */
  async update(req, res) {
    const { id } = req.params;
    const staff = await staffService.update(id, req.body);
    return successResponse(res, staff, 'Staff updated successfully');
  }

  /**
   * PATCH /staff/:id/status
   * Update staff status (working/off_duty)
   */
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const staff = await staffService.updateStatus(id, status);
    return successResponse(res, staff, 'Staff status updated successfully');
  }

  /**
   * PUT /staff/:id/permissions
   * Update staff position/permissions
   */
  async updatePermissions(req, res) {
    const { id } = req.params;
    const staff = await staffService.updatePermissions(id, req.body);
    return successResponse(res, staff, 'Staff permissions updated successfully');
  }

  /**
   * DELETE /staff/:id
   * Delete staff (soft delete by setting status to off_duty)
   */
  async delete(req, res) {
    const { id } = req.params;
    const result = await staffService.delete(id);

    return successResponse(res, result, 'Staff deleted successfully');
  }
}

const controller = new StaffController();

module.exports = {
  getAll: asyncHandler((req, res) => controller.getAll(req, res)),
  getById: asyncHandler((req, res) => controller.getById(req, res)),
  create: asyncHandler((req, res) => controller.create(req, res)),
  update: asyncHandler((req, res) => controller.update(req, res)),
  updateStatus: asyncHandler((req, res) => controller.updateStatus(req, res)),
  updatePermissions: asyncHandler((req, res) =>
    controller.updatePermissions(req, res)
  ),
  delete: asyncHandler((req, res) => controller.delete(req, res)),
};
