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
   * Get catalogs by type
   */
  async getCatalogsByType(type) {
    if (!VALID_CATALOG_TYPES.includes(type)) {
      throw new ValidationError(`Invalid catalog type: ${type}`);
    }

    return await catalogRepository.findByType(type);
  }

  /**
   * Create catalog item
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
   * Update catalog item
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
   * Delete catalog item
   */
  async deleteCatalog(id, updatedBy) {
    const existing = await catalogRepository.findById(id);
    if (!existing || !existing.is_active) {
      throw new NotFoundError('Catalog item not found');
    }

    return await catalogRepository.delete(id, updatedBy);
  }

  /**
   * Get all permissions as matrix
   */
  async getAllPermissions() {
    const permissions = await permissionRepository.findAll();
    return permissionRepository.transformToMatrix(permissions);
  }

  /**
   * Get permissions by position
   */
  async getPermissionsByPosition(position) {
    if (!VALID_POSITIONS.includes(position)) {
      throw new Error(`Invalid position: ${position}`);
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
   * Update permissions (bulk update)
   */
  async updatePermissions(permissionsData, updatedBy) {
    // Validate and transform input
    const flatPermissions = [];

    for (const [position, resources] of Object.entries(permissionsData)) {
      if (!VALID_POSITIONS.includes(position)) {
        throw new Error(`Invalid position: ${position}`);
      }

      for (const [resource, permissions] of Object.entries(resources)) {
        if (!VALID_RESOURCES.includes(resource)) {
          throw new Error(`Invalid resource: ${resource}`);
        }

        for (const [permission, isGranted] of Object.entries(permissions)) {
          if (!VALID_PERMISSIONS.includes(permission)) {
            throw new Error(`Invalid permission: ${permission}`);
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
