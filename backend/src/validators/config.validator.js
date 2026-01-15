/**
 * Config Validation Schemas
 */

const { body, param } = require('express-validator');

const VALID_CATALOG_TYPES = [
  'property_type',
  'area',
  'lead_source',
  'contract_type',
];
const VALID_POSITIONS = [
  'admin',
  'manager',
  'agent',
  'legal_officer',
  'accountant',
];
const VALID_RESOURCES = [
  'transactions',
  'contracts',
  'payments',
  'properties',
  'partners',
  'staff',
];
const VALID_PERMISSIONS = ['view', 'add', 'edit', 'delete'];

/**
 * GET /config/catalogs/:type
 */
const getCatalogSchema = [
  param('type')
    .isIn(VALID_CATALOG_TYPES)
    .withMessage(`Type must be one of: ${VALID_CATALOG_TYPES.join(', ')}`),
];

/**
 * POST /config/catalogs/:type
 */
const createCatalogSchema = [
  param('type')
    .isIn(VALID_CATALOG_TYPES)
    .withMessage(`Type must be one of: ${VALID_CATALOG_TYPES.join(', ')}`),
  body('value')
    .trim()
    .notEmpty()
    .withMessage('Value is required')
    .isLength({ max: 100 })
    .withMessage('Value must not exceed 100 characters'),
];

/**
 * PUT /config/catalogs/:type/:id
 */
const updateCatalogSchema = [
  param('type')
    .isIn(VALID_CATALOG_TYPES)
    .withMessage(`Type must be one of: ${VALID_CATALOG_TYPES.join(', ')}`),
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  body('value')
    .trim()
    .notEmpty()
    .withMessage('Value is required')
    .isLength({ max: 100 })
    .withMessage('Value must not exceed 100 characters'),
];

/**
 * DELETE /config/catalogs/:type/:id
 */
const deleteCatalogSchema = [
  param('type')
    .isIn(VALID_CATALOG_TYPES)
    .withMessage(`Type must be one of: ${VALID_CATALOG_TYPES.join(', ')}`),
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];

/**
 * GET /config/permissions/:position
 */
const getPermissionsByPositionSchema = [
  param('position')
    .isIn(VALID_POSITIONS)
    .withMessage(`Position must be one of: ${VALID_POSITIONS.join(', ')}`),
];

/**
 * PUT /config/permissions
 * Expected body format:
 * {
 *   "agent": {
 *     "transactions": { "view": true, "add": true, "edit": false, "delete": false },
 *     "contracts": { ... }
 *   },
 *   "legal_officer": { ... }
 * }
 */
const updatePermissionsSchema = [
  body()
    .isObject()
    .withMessage('Request body must be an object')
    .custom((value) => {
      // Validate top-level keys are valid positions
      const positions = Object.keys(value);
      const invalidPositions = positions.filter(
        (p) => !VALID_POSITIONS.includes(p)
      );
      if (invalidPositions.length > 0) {
        throw new Error(`Invalid positions: ${invalidPositions.join(', ')}`);
      }

      // Validate each position's structure
      for (const position of positions) {
        const resources = value[position];

        if (typeof resources !== 'object' || resources === null) {
          throw new Error(`${position} must be an object`);
        }

        // Validate resource keys
        const resourceKeys = Object.keys(resources);
        const invalidResources = resourceKeys.filter(
          (r) => !VALID_RESOURCES.includes(r)
        );
        if (invalidResources.length > 0) {
          throw new Error(
            `Invalid resources in ${position}: ${invalidResources.join(', ')}`
          );
        }

        // Validate permissions for each resource
        for (const resource of resourceKeys) {
          const permissions = resources[resource];

          if (typeof permissions !== 'object' || permissions === null) {
            throw new Error(`${position}.${resource} must be an object`);
          }

          const permissionKeys = Object.keys(permissions);
          const invalidPermissions = permissionKeys.filter(
            (p) => !VALID_PERMISSIONS.includes(p)
          );
          if (invalidPermissions.length > 0) {
            throw new Error(
              `Invalid permissions in ${position}.${resource}: ${invalidPermissions.join(', ')}`
            );
          }

          // Validate permission values are boolean
          for (const permission of permissionKeys) {
            if (typeof permissions[permission] !== 'boolean') {
              throw new Error(
                `${position}.${resource}.${permission} must be a boolean`
              );
            }
          }
        }
      }

      return true;
    }),
];

module.exports = {
  getCatalogSchema,
  createCatalogSchema,
  updateCatalogSchema,
  deleteCatalogSchema,
  getPermissionsByPositionSchema,
  updatePermissionsSchema,
};
