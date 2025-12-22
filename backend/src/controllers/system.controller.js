/**
 * System Controller - Cấu hình hệ thống & Logs
 */

const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

class SystemController {
  /**
   * GET /logs
   * Xem nhật ký hoạt động hệ thống
   */
  async getLogs(req, res) {
    const { page = 1, limit = 50 } = req.query;

    return successResponse(
      res,
      {
        items: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      },
      'Logs retrieved successfully'
    );
  }

  /**
   * GET /system/config
   * Lấy cấu hình hệ thống
   */
  async getConfig(req, res) {
    // TODO: Implement - Load from database or config file

    return successResponse(
      res,
      {
        company_name: 'Công ty BĐS ABC',
        company_address: '',
        company_phone: '',
        company_email: '',
        working_hours: { start: '08:00', end: '17:30' },
        appointment_duration_default: 60,
        notification_settings: {
          email_enabled: false,
          sms_enabled: false,
        },
      },
      'System config retrieved successfully'
    );
  }

  /**
   * PUT /system/config
   * Cập nhật cấu hình hệ thống
   */
  async updateConfig(req, res) {
    // TODO: Implement - Save to database

    return successResponse(res, req.body, 'System config updated successfully');
  }

  /**
   * GET /terms
   * Lấy danh sách điều khoản mẫu
   */
  async getTerms(req, res) {
    // TODO: Implement

    return successResponse(res, [], 'Terms retrieved successfully');
  }

  /**
   * POST /terms
   * Tạo điều khoản mẫu mới
   */
  async createTerm(req, res) {
    // TODO: Implement

    return successResponse(
      res,
      req.body,
      'Term created successfully',
      HTTP_STATUS.CREATED
    );
  }

  /**
   * PUT /terms/:id
   * Cập nhật điều khoản mẫu
   */
  async updateTerm(req, res) {
    const { id } = req.params;

    return successResponse(
      res,
      { id, ...req.body },
      'Term updated successfully'
    );
  }

  /**
   * DELETE /terms/:id
   * Xóa điều khoản mẫu
   */
  async deleteTerm(req, res) {
    const { id } = req.params;

    return successResponse(res, { id }, 'Term deleted successfully');
  }
}

const controller = new SystemController();

module.exports = {
  getLogs: asyncHandler((req, res) => controller.getLogs(req, res)),
  getConfig: asyncHandler((req, res) => controller.getConfig(req, res)),
  updateConfig: asyncHandler((req, res) => controller.updateConfig(req, res)),
  getTerms: asyncHandler((req, res) => controller.getTerms(req, res)),
  createTerm: asyncHandler((req, res) => controller.createTerm(req, res)),
  updateTerm: asyncHandler((req, res) => controller.updateTerm(req, res)),
  deleteTerm: asyncHandler((req, res) => controller.deleteTerm(req, res)),
};
