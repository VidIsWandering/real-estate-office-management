/**
 * Auth Controller - Xử lý HTTP requests cho authentication
 */

const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response.util');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/error.middleware');

class AuthController {
  async register(req, res) {
    const result = await authService.register(req.body);

    return successResponse(
      res,
      result,
      'Account registered successfully',
      HTTP_STATUS.CREATED
    );
  }

  async login(req, res) {
    const { username, password } = req.body;
    const result = await authService.login(username, password);

    return successResponse(res, result, 'Login successful');
  }

  async getProfile(req, res) {
    const result = await authService.getProfile(req.user.id);

    // Flatten account + staff into single profile
    const profile = {
      id: result.staff.id,
      username: result.account.username,
      full_name: result.staff.full_name,
      email: result.staff.email,
      phone_number: result.staff.phone_number,
      address: result.staff.address,
      assigned_area: result.staff.assigned_area,
      position: result.staff.position,
      status: result.staff.status,
      preferences: result.staff.preferences,
      created_at: result.account.created_at,
      updated_at: result.staff.updated_at,
    };

    return successResponse(res, profile, 'Profile retrieved successfully');
  }

  async updateProfile(req, res) {
    const result = await authService.updateProfile(req.user.id, req.body);

    // Flatten account + staff into single profile
    const profile = {
      id: result.staff.id,
      username: result.account.username,
      full_name: result.staff.full_name,
      email: result.staff.email,
      phone_number: result.staff.phone_number,
      address: result.staff.address,
      assigned_area: result.staff.assigned_area,
      position: result.staff.position,
      status: result.staff.status,
      preferences: result.staff.preferences,
      created_at: result.account.created_at,
      updated_at: result.staff.updated_at,
    };

    return successResponse(res, profile, 'Profile updated successfully');
  }

  async changePassword(req, res) {
    const { old_password, new_password } = req.body;
    const result = await authService.changePassword(
      req.user.id,
      old_password,
      new_password
    );

    return successResponse(res, result, 'Password changed successfully');
  }

  async refreshToken(req, res) {
    const { refresh_token } = req.body;
    const result = await authService.refreshToken(refresh_token);

    return successResponse(res, result, 'Token refreshed successfully');
  }
}

const controller = new AuthController();

module.exports = {
  register: asyncHandler((req, res) => controller.register(req, res)),
  login: asyncHandler((req, res) => controller.login(req, res)),
  getProfile: asyncHandler((req, res) => controller.getProfile(req, res)),
  updateProfile: asyncHandler((req, res) => controller.updateProfile(req, res)),
  changePassword: asyncHandler((req, res) =>
    controller.changePassword(req, res)
  ),
  refreshToken: asyncHandler((req, res) => controller.refreshToken(req, res)),
};
