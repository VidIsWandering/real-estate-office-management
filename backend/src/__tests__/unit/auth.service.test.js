/**
 * Unit Tests for AuthService
 */

const authService = require('../../services/auth.service');
const accountRepository = require('../../repositories/account.repository');
const staffRepository = require('../../repositories/staff.repository');
const { hashPassword, comparePassword } = require('../../utils/bcrypt.util');

// Mock dependencies
jest.mock('../../repositories/account.repository');
jest.mock('../../repositories/staff.repository');
jest.mock('../../utils/bcrypt.util');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create account and staff successfully', async () => {
      const registerData = {
        username: 'newuser',
        password: 'password123',
        full_name: 'New User',
        email: 'newuser@test.com',
        phone_number: '0912345678',
        role: 'agent',
      };

      accountRepository.findByUsername.mockResolvedValue(null);
      staffRepository.existsByEmail.mockResolvedValue(false);
      hashPassword.mockResolvedValue('hashed_password');

      const mockAccount = {
        id: 1,
        username: 'newuser',
        toJSON: () => ({ id: 1, username: 'newuser' }),
      };

      const mockStaff = {
        id: 1,
        full_name: 'New User',
        toJSON: () => ({ id: 1, full_name: 'New User', position: 'agent' }),
      };

      accountRepository.create.mockResolvedValue(mockAccount);
      staffRepository.create.mockResolvedValue(mockStaff);

      const result = await authService.register(registerData);

      expect(accountRepository.findByUsername).toHaveBeenCalledWith('newuser');
      expect(staffRepository.existsByEmail).toHaveBeenCalledWith(
        'newuser@test.com'
      );
      expect(hashPassword).toHaveBeenCalledWith('password123');
      expect(accountRepository.create).toHaveBeenCalledWith(
        'newuser',
        'hashed_password'
      );
      expect(staffRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('account');
      expect(result).toHaveProperty('staff');
    });

    it('should throw error if username exists', async () => {
      accountRepository.findByUsername.mockResolvedValue({ id: 1 });

      await expect(
        authService.register({
          username: 'existing',
          password: 'password123',
          full_name: 'Test',
        })
      ).rejects.toThrow('Username already exists');
    });

    it('should throw error if email exists', async () => {
      accountRepository.findByUsername.mockResolvedValue(null);
      staffRepository.existsByEmail.mockResolvedValue(true);

      await expect(
        authService.register({
          username: 'newuser',
          password: 'password123',
          full_name: 'Test',
          email: 'existing@test.com',
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockAccount = {
        id: 1,
        username: 'testuser',
        password: 'hashed_password',
        toJSON: () => ({ id: 1, username: 'testuser' }),
      };

      const mockStaff = {
        id: 1,
        position: 'agent',
        status: 'working',
        toJSON: () => ({ id: 1, position: 'agent' }),
      };

      accountRepository.findByUsername.mockResolvedValue(mockAccount);
      comparePassword.mockResolvedValue(true);
      staffRepository.findByAccountId.mockResolvedValue(mockStaff);

      const result = await authService.login('testuser', 'password123');

      expect(accountRepository.findByUsername).toHaveBeenCalledWith('testuser');
      expect(comparePassword).toHaveBeenCalledWith(
        'password123',
        'hashed_password'
      );
      expect(staffRepository.findByAccountId).toHaveBeenCalledWith(1);
      expect(result).toHaveProperty('account');
      expect(result).toHaveProperty('staff');
      expect(result).toHaveProperty('tokens');
      expect(result.tokens).toHaveProperty('access_token');
      expect(result.tokens).toHaveProperty('refresh_token');
    });

    it('should throw error with invalid username', async () => {
      accountRepository.findByUsername.mockResolvedValue(null);

      await expect(
        authService.login('wronguser', 'password123')
      ).rejects.toThrow('Invalid username or password');
    });

    it('should throw error with invalid password', async () => {
      const mockAccount = {
        id: 1,
        username: 'testuser',
        password: 'hashed_password',
      };

      accountRepository.findByUsername.mockResolvedValue(mockAccount);
      comparePassword.mockResolvedValue(false);

      await expect(
        authService.login('testuser', 'wrongpassword')
      ).rejects.toThrow('Invalid username or password');
    });

    it('should throw error if staff is not active', async () => {
      const mockAccount = {
        id: 1,
        username: 'testuser',
        password: 'hashed_password',
        toJSON: () => ({ id: 1, username: 'testuser' }),
      };

      const mockStaff = {
        id: 1,
        position: 'agent',
        status: 'off_duty',
      };

      accountRepository.findByUsername.mockResolvedValue(mockAccount);
      comparePassword.mockResolvedValue(true);
      staffRepository.findByAccountId.mockResolvedValue(mockStaff);

      await expect(
        authService.login('testuser', 'password123')
      ).rejects.toThrow('Account is not active');
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const mockStaff = {
        id: 1,
        email: 'old@test.com',
      };

      const mockUpdatedStaff = {
        id: 1,
        full_name: 'Updated Name',
        email: 'new@test.com',
        preferences: { email: false, sms: true, push: false },
        toJSON: () => ({ id: 1, full_name: 'Updated Name' }),
      };

      const mockAccount = {
        id: 1,
        toJSON: () => ({ id: 1, username: 'testuser' }),
      };

      staffRepository.findByAccountId.mockResolvedValue(mockStaff);
      staffRepository.existsByEmail.mockResolvedValue(false);
      staffRepository.update.mockResolvedValue(mockUpdatedStaff);
      accountRepository.findById.mockResolvedValue(mockAccount);

      const result = await authService.updateProfile(1, {
        full_name: 'Updated Name',
        email: 'new@test.com',
        preferences: { email: false, sms: true, push: false },
      });

      expect(staffRepository.update).toHaveBeenCalled();
      expect(result).toHaveProperty('account');
      expect(result).toHaveProperty('staff');
    });

    it('should throw error if email already exists', async () => {
      const mockStaff = {
        id: 1,
        email: 'old@test.com',
      };

      staffRepository.findByAccountId.mockResolvedValue(mockStaff);
      staffRepository.existsByEmail.mockResolvedValue(true);

      await expect(
        authService.updateProfile(1, { email: 'existing@test.com' })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockAccount = {
        id: 1,
        password: 'old_hashed_password',
      };

      accountRepository.findById.mockResolvedValue(mockAccount);
      comparePassword.mockResolvedValue(true);
      hashPassword.mockResolvedValue('new_hashed_password');
      accountRepository.updatePassword.mockResolvedValue(true);

      const result = await authService.changePassword(
        1,
        'oldpassword',
        'newpassword'
      );

      expect(comparePassword).toHaveBeenCalledWith(
        'oldpassword',
        'old_hashed_password'
      );
      expect(hashPassword).toHaveBeenCalledWith('newpassword');
      expect(accountRepository.updatePassword).toHaveBeenCalledWith(
        1,
        'new_hashed_password'
      );
      expect(result).toHaveProperty('message', 'Password changed successfully');
    });

    it('should throw error if old password is incorrect', async () => {
      const mockAccount = {
        id: 1,
        password: 'old_hashed_password',
      };

      accountRepository.findById.mockResolvedValue(mockAccount);
      comparePassword.mockResolvedValue(false);

      await expect(
        authService.changePassword(1, 'wrongpassword', 'newpassword')
      ).rejects.toThrow('Current password is incorrect');
    });
  });
});
