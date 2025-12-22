/**
 * Staff Controller - Quản lý nhân viên
 */

const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

class StaffController {
  /**
   * GET /staff
   * Lấy danh sách nhân viên
   */
  async getAll(req, res) {
    // TODO: Implement với staffService.getAll(req.query)
    const { page = 1, limit = 10, role, status, search } = req.query;

    return successResponse(
      res,
      {
        items: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      },
      'Staff list retrieved successfully'
    );
  }

  /**
   * GET /staff/:id
   * Lấy thông tin chi tiết nhân viên
   */
  async getById(req, res) {
    // TODO: Implement với staffService.getById(req.params.id)
    const { id } = req.params;

    return successResponse(res, { id }, 'Staff retrieved successfully');
  }

  /**
   * POST /staff
   * Tạo nhân viên mới
   */
  async create(req, res) {
    // TODO: Implement với staffService.create(req.body)

    return successResponse(
      res,
      { ...req.body },
      'Staff created successfully',
      HTTP_STATUS.CREATED
    );
  }

  /**
   * PUT /staff/:id
   * Cập nhật thông tin nhân viên
   */
  async update(req, res) {
    // TODO: Implement với staffService.update(req.params.id, req.body)
    const { id } = req.params;

    return successResponse(
      res,
      { id, ...req.body },
      'Staff updated successfully'
    );
  }

  /**
   * PATCH /staff/:id/status
   * Kích hoạt/vô hiệu hóa nhân viên
   */
  async updateStatus(req, res) {
    // TODO: Implement với staffService.updateStatus(req.params.id, req.body.status)
    const { id } = req.params;
    const { status } = req.body;

    return successResponse(
      res,
      { id, status },
      'Staff status updated successfully'
    );
  }

  /**
   * PUT /staff/:id/permissions
   * Cập nhật quyền hạn nhân viên
   */
  async updatePermissions(req, res) {
    // TODO: Implement với staffService.updatePermissions(req.params.id, req.body)
    const { id } = req.params;

    return successResponse(
      res,
      { id, ...req.body },
      'Staff permissions updated successfully'
    );
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
};
