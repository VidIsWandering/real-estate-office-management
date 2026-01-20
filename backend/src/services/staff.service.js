/**
 * Staff Service - Business logic for staff management
 */

const staffRepository = require('../repositories/staff.repository');
const accountRepository = require('../repositories/account.repository');
const { AppError } = require('../utils/error.util');
const { HTTP_STATUS } = require('../config/constants');
const bcrypt = require('bcryptjs');

class StaffService {
  /**
   * Get all staff with pagination and filters
   */
  async getAll(query) {
    const { page = 1, limit = 10, position, status, search } = query;

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const filters = {};
    if (position) filters.position = position;
    if (status) filters.status = status;
    if (search) filters.search = search;

    const result = await staffRepository.findAll(pageNum, limitNum, filters);

    return {
      items: result.data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        totalPages: Math.ceil(result.total / limitNum),
      },
    };
  }

  /**
   * Get staff by ID
   */
  async getById(id) {
    const staff = await staffRepository.findByIdWithAccount(id);

    if (!staff) {
      throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);
    }

    // Remove sensitive data
    delete staff.password;

    return staff;
  }

  /**
   * Create new staff
   */
  async create(staffData) {
    const {
      username,
      password,
      full_name,
      email,
      phone_number,
      address,
      assigned_area,
      position,
      role,
      status = 'working',
    } = staffData;

    const normalizedPosition = position ?? role ?? 'agent';

    // Validate required fields
    if (!username || !password || !full_name) {
      throw new AppError(
        'Username, password, and full_name are required',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate position
    const validPositions = [
      'admin',
      'agent',
      'legal_officer',
      'accountant',
      'manager',
    ];
    if (!validPositions.includes(normalizedPosition)) {
      throw new AppError('Invalid position', HTTP_STATUS.BAD_REQUEST);
    }

    // Validate status
    const validStatuses = ['working', 'off_duty'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if username already exists
    const existingAccount = await accountRepository.findByUsername(username);
    if (existingAccount) {
      throw new AppError('Username already exists', HTTP_STATUS.CONFLICT);
    }

    // Check if email already exists (if provided)
    if (email) {
      const emailExists = await staffRepository.existsByEmail(email);
      if (emailExists) {
        throw new AppError('Email already exists', HTTP_STATUS.CONFLICT);
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create account first - TRUYỀN 2 THAM SỐ RIÊNG
    const account = await accountRepository.create(username, hashedPassword);

    // Create staff
    try {
      const staff = await staffRepository.create({
        account_id: account.id,
        full_name,
        email,
        phone_number,
        address,
        assigned_area,
        position: normalizedPosition,
        status,
      });

      // Get full staff info with account
      const fullStaff = await staffRepository.findByIdWithAccount(staff.id);
      delete fullStaff.password;

      return fullStaff;
    } catch (error) {
      // Rollback: delete account if staff creation fails
      await accountRepository.delete(account.id);
      throw error;
    }
  }

  /**
   * Update staff information
   */
  async update(id, updateData) {
    // Check if staff exists
    const existingStaff = await staffRepository.findById(id);
    if (!existingStaff) {
      throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);
    }

    const {
      full_name,
      email,
      phone_number,
      address,
      assigned_area,
      position,
      role,
      status,
    } = updateData;

    const normalizedPosition = position ?? role;

    // Validate position if provided
    if (normalizedPosition) {
      const validPositions = [
        'admin',
        'agent',
        'legal_officer',
        'accountant',
        'manager',
      ];
      if (!validPositions.includes(normalizedPosition)) {
        throw new AppError('Invalid position', HTTP_STATUS.BAD_REQUEST);
      }
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['working', 'off_duty'];
      if (!validStatuses.includes(status)) {
        throw new AppError('Invalid status', HTTP_STATUS.BAD_REQUEST);
      }
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingStaff.email) {
      const emailExists = await staffRepository.existsByEmail(email);
      if (emailExists) {
        throw new AppError('Email already exists', HTTP_STATUS.CONFLICT);
      }
    }

    // Update staff
    const updatedStaff = await staffRepository.update(id, {
      full_name,
      email,
      phone_number,
      address,
      assigned_area,
      position: normalizedPosition,
      status,
    });

    // Get full staff info with account
    const fullStaff = await staffRepository.findByIdWithAccount(
      updatedStaff.id
    );
    delete fullStaff.password;

    return fullStaff;
  }

  /**
   * Update staff status
   */
  async updateStatus(id, status) {
    // Validate status
    const validStatuses = ['working', 'off_duty'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if staff exists
    const existingStaff = await staffRepository.findById(id);
    if (!existingStaff) {
      throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);
    }

    // Update status
    const updatedStaff = await staffRepository.update(id, { status });

    // Get full staff info with account
    const fullStaff = await staffRepository.findByIdWithAccount(
      updatedStaff.id
    );
    delete fullStaff.password;

    return fullStaff;
  }

  /**
   * Update staff permissions (position)
   */
  async updatePermissions(id, permissionsData) {
    const position =
      typeof permissionsData === 'string'
        ? permissionsData
        : permissionsData?.position ?? permissionsData?.role;

    if (!position) {
      throw new AppError('Position is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Validate position
    const validPositions = [
      'admin',
      'agent',
      'legal_officer',
      'accountant',
      'manager',
    ];
    if (!validPositions.includes(position)) {
      throw new AppError('Invalid position', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if staff exists
    const existingStaff = await staffRepository.findById(id);
    if (!existingStaff) {
      throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);
    }

    // Update position
    const updatedStaff = await staffRepository.update(id, { position });

    // Get full staff info with account
    const fullStaff = await staffRepository.findByIdWithAccount(
      updatedStaff.id
    );
    delete fullStaff.password;

    return fullStaff;
  }

  /**
   * Delete staff (soft delete by changing status)
   */
  async delete(id) {
    // Check if staff exists
    const existingStaff = await staffRepository.findById(id);
    if (!existingStaff) {
      throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);
    }

    // Set status to off_duty instead of hard delete
    await staffRepository.update(id, { status: 'off_duty' });

    return { message: 'Staff deleted successfully' };
  }

  /**
   * Get staff by account ID
   */
  async getByAccountId(accountId) {
    const staff = await staffRepository.findByAccountId(accountId);

    if (!staff) {
      throw new AppError('Staff not found', HTTP_STATUS.NOT_FOUND);
    }

    return staff;
  }
}

module.exports = new StaffService();
