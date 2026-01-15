/**
 * System Controller - Cấu hình hệ thống & Logs
 */

const systemService = require('../services/system.service');
const systemConfigRepository = require('../repositories/system-config.repository');
const { successResponse, errorResponse } = require('../utils/response.util');
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
    const config = await systemService.getConfig();

    return successResponse(res, config, 'System config retrieved successfully');
  }

  /**
   * GET /system/configs
   * Lấy tất cả cấu hình dưới dạng array (với keys frontend-friendly)
   */
  async getAllConfigs(req, res) {
    // Get raw configs from database
    const allConfigs = await systemConfigRepository.getAll();

    // Transform to frontend-friendly format
    const configsArray = [];

    for (const config of allConfigs) {
      if (config.key === 'company_info') {
        // Map company_info fields to office_* keys
        const info = config.value;
        if (info.company_name !== undefined) {
          configsArray.push({
            key: 'office_name',
            value: info.company_name,
            updated_at: config.updated_at,
          });
        }
        if (info.company_address !== undefined) {
          configsArray.push({
            key: 'office_address',
            value: info.company_address,
            updated_at: config.updated_at,
          });
        }
        if (info.company_phone !== undefined) {
          configsArray.push({
            key: 'office_phone',
            value: info.company_phone,
            updated_at: config.updated_at,
          });
        }
        if (info.company_email !== undefined) {
          configsArray.push({
            key: 'office_email',
            value: info.company_email,
            updated_at: config.updated_at,
          });
        }
        // Add region as separate field (can be same as address initially)
        if (info.company_address !== undefined) {
          configsArray.push({
            key: 'office_region',
            value: info.company_address,
            updated_at: config.updated_at,
          });
        }
      } else if (config.key === 'notification_settings') {
        // Map notification fields
        const settings = config.value;
        if (settings.email !== undefined) {
          configsArray.push({
            key: 'notification_email',
            value: settings.email,
            updated_at: config.updated_at,
          });
        }
        if (settings.sms !== undefined) {
          configsArray.push({
            key: 'notification_sms',
            value: settings.sms,
            updated_at: config.updated_at,
          });
        }
        if (settings.push !== undefined) {
          configsArray.push({
            key: 'notification_push',
            value: settings.push,
            updated_at: config.updated_at,
          });
        }
      }
    }

    return successResponse(
      res,
      configsArray,
      'System configs retrieved successfully'
    );
  }

  /**
   * PUT /system/config
   * Cập nhật cấu hình hệ thống
   */
  async updateConfig(req, res) {
    const updatedConfig = await systemService.updateConfig(
      req.body,
      req.user.staff_id
    );

    return successResponse(
      res,
      updatedConfig,
      'System config updated successfully'
    );
  }

  /**
   * PUT /system/configs/:key
   * Cập nhật một config cụ thể
   */
  async updateSingleConfig(req, res) {
    const { key } = req.params;
    const { value } = req.body;

    // Map frontend keys to database structure
    const keyMapping = {
      // Office info -> company_info
      office_name: { dbKey: 'company_info', field: 'company_name' },
      office_region: { dbKey: 'company_info', field: 'company_address' }, // Region stored as address for now
      office_phone: { dbKey: 'company_info', field: 'company_phone' },
      office_address: { dbKey: 'company_info', field: 'company_address' },
      office_email: { dbKey: 'company_info', field: 'company_email' },

      // Notifications -> notification_settings
      notification_email: { dbKey: 'notification_settings', field: 'email' },
      notification_sms: { dbKey: 'notification_settings', field: 'sms' },
      notification_push: { dbKey: 'notification_settings', field: 'push' },
    };

    const mapping = keyMapping[key];

    if (!mapping) {
      return errorResponse(
        res,
        `Unknown config key: ${key}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Get current config for the DB key
    const currentConfig = await systemConfigRepository.getByKey(mapping.dbKey);
    const configValue = currentConfig?.value || {};

    // Update the specific field
    configValue[mapping.field] = value;

    // Save back to database
    await systemConfigRepository.update(
      mapping.dbKey,
      configValue,
      req.user.staff_id
    );

    return successResponse(
      res,
      { key, value, updated_at: new Date().toISOString() },
      'System config updated successfully'
    );
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
  getAllConfigs: asyncHandler((req, res) => controller.getAllConfigs(req, res)),
  updateConfig: asyncHandler((req, res) => controller.updateConfig(req, res)),
  updateSingleConfig: asyncHandler((req, res) =>
    controller.updateSingleConfig(req, res)
  ),
  getTerms: asyncHandler((req, res) => controller.getTerms(req, res)),
  createTerm: asyncHandler((req, res) => controller.createTerm(req, res)),
  updateTerm: asyncHandler((req, res) => controller.updateTerm(req, res)),
  deleteTerm: asyncHandler((req, res) => controller.deleteTerm(req, res)),
};
