/**
 * Security Controller - HTTP handlers for security features
 */

const securityService = require('../services/security.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../middlewares/error.middleware');

class SecurityController {
  /**
   * GET /auth/sessions
   * Get all active sessions
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @returns {Promise<Object>} Success response with sessions
   */
  async getSessions(req, res) {
    const sessions = await securityService.getSessions(req.user.id);
    return successResponse(res, sessions, 'Sessions retrieved successfully');
  }

  /**
   * DELETE /auth/sessions/:id
   * Revoke a specific session
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @returns {Promise<Object>} Success response
   */
  async revokeSession(req, res) {
    const sessionId = parseInt(req.params.id);
    const result = await securityService.revokeSession(sessionId, req.user.id);
    return successResponse(res, result, 'Session revoked successfully');
  }

  /**
   * POST /auth/sessions/revoke-all
   * Revoke all sessions except current
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @returns {Promise<Object>} Success response
   */
  async revokeAllSessions(req, res) {
    const currentSessionId = req.body.current_session_id;
    const result = await securityService.revokeAllSessions(
      req.user.id,
      currentSessionId
    );
    return successResponse(res, result, 'All sessions revoked successfully');
  }

  /**
   * GET /auth/login-history
   * Get login history
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @returns {Promise<Object>} Success response with history
   */
  async getLoginHistory(req, res) {
    const limit = parseInt(req.query.limit) || 50;
    const history = await securityService.getLoginHistory(
      req.user.staff_id,
      limit
    );
    return successResponse(
      res,
      history,
      'Login history retrieved successfully'
    );
  }

  /**
   * POST /auth/2fa/enable
   * Enable 2FA
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @returns {Promise<Object>} Success response with 2FA setup data
   */
  async enable2FA(req, res) {
    const result = await securityService.enable2FA(req.user.id);
    return successResponse(res, result, '2FA enabled successfully');
  }

  /**
   * POST /auth/2fa/disable
   * Disable 2FA
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @returns {Promise<Object>} Success response
   */
  async disable2FA(req, res) {
    const result = await securityService.disable2FA(req.user.id);
    return successResponse(res, result, '2FA disabled successfully');
  }

  /**
   * POST /auth/2fa/verify
   * Verify 2FA token
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @returns {Promise<Object>} Success response
   */
  async verify2FA(req, res) {
    const { token } = req.body;
    const result = await securityService.verify2FA(req.user.id, token);
    return successResponse(res, { valid: result }, '2FA token verified');
  }
}

const controller = new SecurityController();

module.exports = {
  getSessions: asyncHandler((req, res) => controller.getSessions(req, res)),
  revokeSession: asyncHandler((req, res) => controller.revokeSession(req, res)),
  revokeAllSessions: asyncHandler((req, res) =>
    controller.revokeAllSessions(req, res)
  ),
  getLoginHistory: asyncHandler((req, res) =>
    controller.getLoginHistory(req, res)
  ),
  enable2FA: asyncHandler((req, res) => controller.enable2FA(req, res)),
  disable2FA: asyncHandler((req, res) => controller.disable2FA(req, res)),
  verify2FA: asyncHandler((req, res) => controller.verify2FA(req, res)),
};
