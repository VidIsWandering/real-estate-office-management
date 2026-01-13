/**
 * Config Service - Business logic for configuration management
 */

const catalogRepository = require('../repositories/catalog.repository');
const permissionRepository = require('../repositories/permission.repository');
const {
  ValidationError,
  ConflictError,
  NotFoundError,
} = require('../utils/error.util');

// Valid catalog types
const VALID_CATALOG_TYPES = [
  'property_type',
  'area',
  'lead_source',
  'contract_type',
];

// Valid positions for permissions
const VALID_POSITIONS = ['agent', 'legal_officer', 'accountant'];

// Valid resources
const VALID_RESOURCES = [
  'transactions',
  'contracts',
  'payments',
  'properties',
  'partners',
  'staff',
];

// Valid permissions
const VALID_PERMISSIONS = ['view', 'add', 'edit', 'delete'];

class ConfigService {
  /**
   * Get all active catalogs for a specific type
   * @param {string} type - Catalog type (property_type, area, lead_source, contract_type)
   * @returns {Promise<Array>} Array of catalog items
   * @throws {ValidationError} If type is invalid
   */
  async getCatalogsByType(type) {
    if (!VALID_CATALOG_TYPES.includes(type)) {
      throw new ValidationError(`Invalid catalog type: ${type}`);
    }

    return await catalogRepository.findByType(type);
  }

  /**
   * Create a new catalog item
   * @param {string} type - Catalog type
   * @param {string} value - Catalog value
   * @param {number} createdBy - Staff ID of creator
   * @returns {Promise<Object>} Created catalog item
   * @throws {ValidationError} If type is invalid, value is empty, or value already exists
   */
  async createCatalog(type, value, createdBy) {
    if (!VALID_CATALOG_TYPES.includes(type)) {
      throw new ValidationError(`Invalid catalog type: ${type}`);
    }

    if (!value || value.trim().length === 0) {
      throw new ValidationError('Value is required');
    }

    const trimmedValue = value.trim();

    // Check if value already exists
    const exists = await catalogRepository.existsByTypeAndValue(
      type,
      trimmedValue
    );
    if (exists) {
      throw new ValidationError(
        `Value "${trimmedValue}" already exists for ${type}`
      );
    }

    return await catalogRepository.create(type, trimmedValue, createdBy);
  }

  /**
   * Update an existing catalog item
   * @param {number} id - Catalog item ID
   * @param {string} value - New value
   * @param {number} updatedBy - Staff ID of updater
   * @returns {Promise<Object>} Updated catalog item
   * @throws {ValidationError} If value is empty or already exists
   * @throws {NotFoundError} If catalog item not found or inactive
   */
  async updateCatalog(id, value, updatedBy) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Value is required');
    }

    const existing = await catalogRepository.findById(id);
    if (!existing || !existing.is_active) {
      throw new NotFoundError('Catalog item not found');
    }

    const trimmedValue = value.trim();

    // Check if new value conflicts with existing
    const exists = await catalogRepository.existsByTypeAndValue(
      existing.type,
      trimmedValue,
      id
    );
    if (exists) {
      throw new ValidationError(
        `Value "${trimmedValue}" already exists for ${existing.type}`
      );
    }

    return await catalogRepository.update(id, trimmedValue, updatedBy);
  }

  /**
   * Soft delete a catalog item (sets is_active = false)
   * @param {number} id - Catalog item ID
   * @param {number} updatedBy - Staff ID of deleter
   * @returns {Promise<boolean>} True if deleted successfully
   * @throws {NotFoundError} If catalog item not found or already inactive
   */
  async deleteCatalog(id, updatedBy) {
    const existing = await catalogRepository.findById(id);
    if (!existing || !existing.is_active) {
      throw new NotFoundError('Catalog item not found');
    }

    return await catalogRepository.delete(id, updatedBy);
  }

  /**
   * Get all role permissions organized as a matrix
   * Matrix structure: { position: { resource: { permission: boolean } } }
   * @returns {Promise<Object>} Permission matrix by position
   */
  async getAllPermissions() {
    const permissions = await permissionRepository.findAll();
    return permissionRepository.transformToMatrix(permissions);
  }

  /**
   * Get permissions for a specific position/role
   * Returns object structure: { resource: { permission: boolean } }
   * @param {string} position - Position/role (agent, legal_officer, accountant)
   * @returns {Promise<Object>} Permissions grouped by resource
   * @throws {ValidationError} If position is invalid
   */
  async getPermissionsByPosition(position) {
    if (!VALID_POSITIONS.includes(position)) {
      throw new ValidationError(`Invalid position: ${position}`);
    }

    const permissions = await permissionRepository.findByPosition(position);
    const matrix = {};

    for (const perm of permissions) {
      if (!matrix[perm.resource]) {
        matrix[perm.resource] = {};
      }
      matrix[perm.resource][perm.permission] = perm.is_granted;
    }

    return matrix;
  }

  /**
   * Bulk update role permissions
   * @param {Object} permissionsData - Permission matrix: { position: { resource: { permission: boolean } } }
   * @param {number} updatedBy - Staff ID of updater
   * @returns {Promise<Object>} Updated permission matrix
   * @throws {ValidationError} If position, resource, or permission is invalid
   */
  async updatePermissions(permissionsData, updatedBy) {
    // Validate and transform input
    const flatPermissions = [];

    for (const [position, resources] of Object.entries(permissionsData)) {
      if (!VALID_POSITIONS.includes(position)) {
        throw new ValidationError(`Invalid position: ${position}`);
      }

      for (const [resource, permissions] of Object.entries(resources)) {
        if (!VALID_RESOURCES.includes(resource)) {
          throw new ValidationError(`Invalid resource: ${resource}`);
        }

        for (const [permission, isGranted] of Object.entries(permissions)) {
          if (!VALID_PERMISSIONS.includes(permission)) {
            throw new ValidationError(`Invalid permission: ${permission}`);
          }

          flatPermissions.push({
            position,
            resource,
            permission,
            is_granted: Boolean(isGranted),
          });
        }
      }
    }

    // Bulk upsert
    await permissionRepository.bulkUpsert(flatPermissions, updatedBy);

    // Return updated matrix
    return await this.getAllPermissions();
  }
}

module.exports = new ConfigService();
