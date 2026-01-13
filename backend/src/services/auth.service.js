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

class AuthService {
  /**
   * Register new account + staff
   */
  async register(registerData) {
    const { username, password, full_name, email, phone_number, position } =
      registerData;

    // Check username đã tồn tại chưa
    const existingAccount = await accountRepository.findByUsername(username);
    if (existingAccount) {
      throw new Error('Username already exists');
    }

    // Check email đã tồn tại chưa (nếu có)
    if (email) {
      const emailExists = await staffRepository.existsByEmail(email);
      if (emailExists) {
        throw new Error('Email already exists');
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
      position: position || STAFF_ROLES.STAFF,
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
      throw new Error('Invalid username or password');
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, account.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    // Get staff info
    const staff = await staffRepository.findByAccountId(account.id);
    if (!staff) {
      throw new Error('Staff profile not found');
    }

    // Check staff status
    if (staff.status !== 'working') {
      throw new Error('Account is not active');
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

  async updateProfile(accountId, newProfile) {
    try {
      const currentStaff = await staffRepository.findByAccountId(accountId);
      if (!currentStaff) {
        throw new Error('Staff profile not found');
      }
      await staffRepository.update(currentStaff.id, newProfile);

      const updatedProfile = this.getProfile(accountId);

      return updatedProfile;
    } catch (error) {
      console.log(error);
      throw new Error('ERROR: Update profile');
    }
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
   * Refresh token (optional - có thể implement sau)
   */
  async refreshToken() {
    // TODO: Implement refresh token logic
    // Verify refresh token → Generate new access token
    throw new Error('Not implemented yet');
  }
}

module.exports = new AuthService();
