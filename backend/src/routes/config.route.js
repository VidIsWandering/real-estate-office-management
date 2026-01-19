/**
 * Config Routes - Configuration management endpoints
 */

const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { STAFF_ROLES } = require('../config/constants');
const {
  getCatalogSchema,
  createCatalogSchema,
  updateCatalogSchema,
  deleteCatalogSchema,
  getPermissionsByPositionSchema,
  updatePermissionsSchema,
} = require('../validators/config.validator');

// All routes require authentication and manager/admin role
const requireManagerOrAdmin = authorize([
  STAFF_ROLES.MANAGER,
  STAFF_ROLES.ADMIN,
]);

// Catalog routes
router.get(
  '/catalogs/:type',
  authenticate,
  requireManagerOrAdmin,
  getCatalogSchema,
  validate,
  configController.getCatalogsByType
);

router.post(
  '/catalogs/:type',
  authenticate,
  requireManagerOrAdmin,
  createCatalogSchema,
  validate,
  configController.createCatalog
);

router.put(
  '/catalogs/:type/:id',
  authenticate,
  requireManagerOrAdmin,
  updateCatalogSchema,
  validate,
  configController.updateCatalog
);

router.delete(
  '/catalogs/:type/:id',
  authenticate,
  requireManagerOrAdmin,
  deleteCatalogSchema,
  validate,
  configController.deleteCatalog
);

// Permission routes
router.get(
  '/permissions',
  authenticate,
  requireManagerOrAdmin,
  configController.getAllPermissions
);

router.get(
  '/permissions/:position',
  authenticate,
  requireManagerOrAdmin,
  getPermissionsByPositionSchema,
  validate,
  configController.getPermissionsByPosition
);

router.put(
  '/permissions',
  authenticate,
  requireManagerOrAdmin,
  updatePermissionsSchema,
  validate,
  configController.updatePermissions
);

module.exports = router;
