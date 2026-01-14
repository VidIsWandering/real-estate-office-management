/**
 * Auth Routes
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const securityController = require('../controllers/security.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  uploadAvatar,
  handleUploadError,
} = require('../middlewares/upload.middleware');
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} = require('../validators/auth.validator');
const {
  sessionIdValidator,
  loginHistoryValidator,
  revokeAllSessionsValidator,
  verify2FAValidator,
} = require('../validators/security.validator');

/**
 * @route   POST /api/auth/register
 * @desc    Register new account
 * @access  Public
 */
router.post('/register', registerValidator, validate, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login
 * @access  Public
 */
router.post('/login', loginValidator, validate, authController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  updateProfileValidator,
  validate,
  authController.updateProfile
);

/**
 * @route   POST /api/auth/profile/avatar
 * @desc    Upload profile avatar
 * @access  Private
 */
router.post(
  '/profile/avatar',
  authenticate,
  uploadAvatar,
  handleUploadError,
  authController.uploadAvatar
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.put(
  '/change-password',
  authenticate,
  changePasswordValidator,
  validate,
  authController.changePassword
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', authController.refreshToken);

// ==================== Security Features ====================

/**
 * @route   GET /api/auth/sessions
 * @desc    Get all active sessions
 * @access  Private
 */
router.get('/sessions', authenticate, securityController.getSessions);

/**
 * @route   DELETE /api/auth/sessions/:id
 * @desc    Revoke a specific session
 * @access  Private
 */
router.delete(
  '/sessions/:id',
  authenticate,
  sessionIdValidator,
  validate,
  securityController.revokeSession
);

/**
 * @route   POST /api/auth/sessions/revoke-all
 * @desc    Revoke all sessions except current
 * @access  Private
 */
router.post(
  '/sessions/revoke-all',
  authenticate,
  revokeAllSessionsValidator,
  validate,
  securityController.revokeAllSessions
);

/**
 * @route   GET /api/auth/login-history
 * @desc    Get login history
 * @access  Private
 */
router.get(
  '/login-history',
  authenticate,
  loginHistoryValidator,
  validate,
  securityController.getLoginHistory
);

/**
 * @route   POST /api/auth/2fa/enable
 * @desc    Enable 2FA (placeholder)
 * @access  Private
 */
router.post('/2fa/enable', authenticate, securityController.enable2FA);

/**
 * @route   POST /api/auth/2fa/disable
 * @desc    Disable 2FA (placeholder)
 * @access  Private
 */
router.post('/2fa/disable', authenticate, securityController.disable2FA);

/**
 * @route   POST /api/auth/2fa/verify
 * @desc    Verify 2FA token (placeholder)
 * @access  Private
 */
router.post(
  '/2fa/verify',
  authenticate,
  verify2FAValidator,
  validate,
  securityController.verify2FA
);

module.exports = router;
