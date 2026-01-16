/**
 * Real Estate Routes
 */

const express = require('express');
const router = express.Router();

const realEstateController = require('../controllers/real-estate.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { STAFF_ROLES } = require('../config/constants');
const upload = require('../middlewares/upload.middleware');
const {
  getAllRealEstateValidator,
  createRealEstateValidator,
  updateRealEstateValidator,
} = require('../validators/real-estate.validator');
const { validate } = require('../middlewares/validate.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/real-estates
 * @desc    Get all real estates
 * @access  Private
 */
router.get('/', authenticate, realEstateController.getAll);

/**
 * @route   GET /api/v1/real-estates/:id
 * @desc    Get real estate by ID
 * @access  Private
 */
router.get('/:id', realEstateController.getById);

/**
 * @route   POST /api/v1/real-estates
 * @desc    Create new real estate
 * @access  Private (Agent)
 */
router.post(
  '/',
  authorize([STAFF_ROLES.AGENT, STAFF_ROLES.MANAGER]),

  upload.fields([
    { name: 'media_files', maxCount: 10 },
    { name: 'legal_docs', maxCount: 10 },
  ]),
  createRealEstateValidator,
  validate,

  realEstateController.create
);

/**
 * @route   PUT /api/v1/real-estates/:id
 * @desc    Update real estate
 * @access  Private (Agent)
 */
router.put(
  '/:id',
  authorize([STAFF_ROLES.AGENT, STAFF_ROLES.MANAGER]),

  upload.fields([
    { name: 'media_files', maxCount: 10 },
    { name: 'legal_docs', maxCount: 10 },
  ]),
  updateRealEstateValidator,
  validate,
  realEstateController.update
);

/**
 * @route   PUT /api/v1/real-estates/:id/legal-check
 * @desc    Legal officer approval
 * @access  Private (Legal Officer/Staff)
 */
router.put(
  '/:id/legal-check',
  authorize([STAFF_ROLES.LEGAL_OFFICER, STAFF_ROLES.MANAGER]),
  realEstateController.legalCheck
);

/**
 * @route   PATCH /api/v1/real-estates/:id/status
 * @desc    Update real estate status
 * @access  Private
 */
router.patch('/:id/status', realEstateController.updateStatus);

/**
 * @route   GET /api/v1/real-estates/:id/price-history
 * @desc    Get price history
 * @access  Private
 */
router.get('/:id/price-history', realEstateController.getPriceHistory);

module.exports = router;
