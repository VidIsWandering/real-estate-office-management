/**
 * Config Controller - HTTP requests for configuration management
 */

const configService = require('../services/config.service');
const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

class ConfigController {
  /**
   * GET /config/catalogs/:type
   * Get all active catalogs for a specific type
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} Success response with catalog items
   */
  async getCatalogsByType(req, res) {
    const { type } = req.params;
    const catalogs = await configService.getCatalogsByType(type);

    return successResponse(res, catalogs, 'Catalogs retrieved successfully');
  }

  /**
   * POST /config/catalogs/:type
   * Create a new catalog item
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} Success response with created catalog (201 status)
   */
  async createCatalog(req, res) {
    const { type } = req.params;
    const { value } = req.body;
    const createdBy = req.user.staff_id;

    const catalog = await configService.createCatalog(type, value, createdBy);

    return successResponse(
      res,
      catalog,
      'Catalog created successfully',
      HTTP_STATUS.CREATED
    );
  }

  /**
   * PUT /config/catalogs/:type/:id
   * Update an existing catalog item
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} Success response with updated catalog
   */
  async updateCatalog(req, res) {
    const { id } = req.params;
    const { value } = req.body;
    const updatedBy = req.user.staff_id;

    const catalog = await configService.updateCatalog(
      parseInt(id),
      value,
      updatedBy
    );

    return successResponse(res, catalog, 'Catalog updated successfully');
  }

  /**
   * DELETE /config/catalogs/:type/:id
   * Soft delete a catalog item
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} Success response with deleted item ID
   */
  async deleteCatalog(req, res) {
    const { id } = req.params;
    const updatedBy = req.user.staff_id;

    await configService.deleteCatalog(parseInt(id), updatedBy);

    return successResponse(res, { id }, 'Catalog deleted successfully');
  }

  /**
   * GET /config/permissions
   * Get all role permissions organized as a matrix
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} Success response with permission matrix
   */
  async getAllPermissions(req, res) {
    const permissions = await configService.getAllPermissions();

    return successResponse(
      res,
      permissions,
      'Permissions retrieved successfully'
    );
  }

  /**
   * GET /config/permissions/:position
   * Get permissions for a specific position/role
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} Success response with position permissions
   */
  async getPermissionsByPosition(req, res) {
    const { position } = req.params;
    const permissions = await configService.getPermissionsByPosition(position);

    return successResponse(
      res,
      permissions,
      'Permissions retrieved successfully'
    );
  }

  /**
   * PUT /config/permissions
   * Bulk update role permissions
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} Success response with updated permissions
   */
  async updatePermissions(req, res) {
    const permissionsData = req.body;
    const updatedBy = req.user.staff_id;

    const updated = await configService.updatePermissions(
      permissionsData,
      updatedBy
    );

    return successResponse(res, updated, 'Permissions updated successfully');
  }
}

const controller = new ConfigController();

module.exports = {
  getCatalogsByType: asyncHandler((req, res) =>
    controller.getCatalogsByType(req, res)
  ),
  createCatalog: asyncHandler((req, res) => controller.createCatalog(req, res)),
  updateCatalog: asyncHandler((req, res) => controller.updateCatalog(req, res)),
  deleteCatalog: asyncHandler((req, res) => controller.deleteCatalog(req, res)),
  getAllPermissions: asyncHandler((req, res) =>
    controller.getAllPermissions(req, res)
  ),
  getPermissionsByPosition: asyncHandler((req, res) =>
    controller.getPermissionsByPosition(req, res)
  ),
  updatePermissions: asyncHandler((req, res) =>
    controller.updatePermissions(req, res)
  ),
};
