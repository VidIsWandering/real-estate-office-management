/**
 * Auth Service - Business logic cho authentication
 */

const accountRepository = require('../repositories/account.repository');
const staffRepository = require('../repositories/staff.repository');
const { hashPassword, comparePassword } = require('../utils/bcrypt.util');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/jwt.util');
const { STAFF_ROLES } = require('../config/constants');
const { ValidationError, NotFoundError } = require('../utils/error.util');

class AuthService {
  /**
   * Register new account + staff
   */
  async register(registerData) {
    const { username, password, full_name, email, phone_number, role } =
      registerData;

    // Check username đã tồn tại chưa
    const existingAccount = await accountRepository.findByUsername(username);
    if (existingAccount) {
      throw new ValidationError('Username already exists');
    }

    // Check email đã tồn tại chưa (nếu có)
    if (email) {
      const emailExists = await staffRepository.existsByEmail(email);
      if (emailExists) {
        throw new ValidationError('Email already exists');
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create account
    const account = await accountRepository.create(username, hashedPassword);

    // Create staff profile
    const staffData = {
      account_id: account.id,
      full_name,
      email,
      phone_number,
      position: role || STAFF_ROLES.AGENT,
      status: 'working',
    };

    const staff = await staffRepository.create(staffData);

    return {
      account: account.toJSON(),
      staff: staff.toJSON(),
    };
  }

  /**
   * Login
   */
  async login(username, password) {
    // Find account
    const account = await accountRepository.findByUsername(username);
    if (!account) {
      throw new ValidationError('Invalid username or password');
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, account.password);
    if (!isPasswordValid) {
      throw new ValidationError('Invalid username or password');
    }

    // Get staff info
    const staff = await staffRepository.findByAccountId(account.id);
    if (!staff) {
      throw new NotFoundError('Staff profile not found');
    }

    // Check staff status
    if (staff.status !== 'working') {
      throw new ValidationError('Account is not active');
    }

    // Generate tokens
    const payload = {
      id: account.id,
      username: account.username,
      staff_id: staff.id,
      position: staff.position,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      account: account.toJSON(),
      staff: staff.toJSON(),
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }

  /**
   * Get profile by account_id
   */
  async getProfile(accountId) {
    const account = await accountRepository.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const staff = await staffRepository.findByAccountId(accountId);
    if (!staff) {
      throw new Error('Staff profile not found');
    }

    return {
      account: account.toJSON(),
      staff: staff.toJSON(),
    };
  }

  /**
   * Update profile
   */
  async updateProfile(accountId, updateData) {
    const {
      full_name,
      email,
      phone_number,
      address,
      assigned_area,
      preferences,
    } = updateData;

    // Get current staff profile
    const staff = await staffRepository.findByAccountId(accountId);
    if (!staff) {
      throw new Error('Staff profile not found');
    }

    // Check if email is being changed and already exists
    if (email && email !== staff.email) {
      const emailExists = await staffRepository.existsByEmail(email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    // Update staff profile
    const staffData = {
      full_name,
      email,
      phone_number,
      address,
      assigned_area,
      preferences,
    };

    const updatedStaff = await staffRepository.update(staff.id, staffData);

    // Get updated account info
    const account = await accountRepository.findById(accountId);

    return {
      account: account.toJSON(),
      staff: updatedStaff.toJSON(),
    };
  }

  /**
   * Change password
   */
  async changePassword(accountId, oldPassword, newPassword) {
    // Get account
    const account = await accountRepository.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Verify old password
    const isPasswordValid = await comparePassword(
      oldPassword,
      account.password
    );
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await accountRepository.updatePassword(accountId, hashedPassword);

    return { message: 'Password changed successfully' };
  }

  /**
   * Upload avatar
   * @param {number} accountId - Account ID
   * @param {string} avatarPath - Path to uploaded avatar file
   * @returns {Promise<Object>} Updated staff profile
   */
  async uploadAvatar(accountId, avatarPath) {
    // Get staff profile
    const staff = await staffRepository.findByAccountId(accountId);
    if (!staff) {
      throw new NotFoundError('Staff profile not found');
    }

    // Update avatar path (relative path for serving)
    const avatarUrl = `/uploads/avatars/${avatarPath.split('/').pop()}`;
    const updatedStaff = await staffRepository.update(staff.id, {
      avatar: avatarUrl,
    });

    return {
      avatar: avatarUrl,
      staff: updatedStaff.toJSON(),
    };
  }

  /**
   * Refresh token (optional - có thể implement sau)
   */
  async refreshToken() {
    // TODO: Implement refresh token logic
    // Verify refresh token → Generate new access token
    throw new Error('Not implemented yet');
  }
}

module.exports = new AuthService();
