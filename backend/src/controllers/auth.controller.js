/**
 * Auth Controller - Xử lý HTTP requests cho authentication
 */

const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

class AuthController {
  /**
   * Register
   * POST /api/auth/register
   */
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    return successResponse(
      res,
      result,
      'Account registered successfully',
      HTTP_STATUS.CREATED
    );
  });

  /**
   * Login
   * POST /api/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const result = await authService.login(username, password);

    return successResponse(res, result, 'Login successful');
  });

  /**
   * Get profile
   * GET /api/auth/profile
   */
  getProfile = asyncHandler(async (req, res) => {
    const result = await authService.getProfile(req.user.id);

    return successResponse(res, result, 'Profile retrieved successfully');
  });

  /**
   * Change password
   * PUT /api/auth/change-password
   */
  changePassword = asyncHandler(async (req, res) => {
    const { old_password, new_password } = req.body;
    const result = await authService.changePassword(
      req.user.id,
      old_password,
      new_password
    );

    return successResponse(res, result, 'Password changed successfully');
  });

  /**
   * Refresh token (optional)
   * POST /api/auth/refresh-token
   */
  refreshToken = asyncHandler(async (req, res) => {
    const { refresh_token } = req.body;
    const result = await authService.refreshToken(refresh_token);

    return successResponse(res, result, 'Token refreshed successfully');
  });
}

module.exports = new AuthController();
