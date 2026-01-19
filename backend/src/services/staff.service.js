/**
 * Staff Service - Business logic cho quản lý nhân viên
 */

const accountRepository = require('../repositories/account.repository');
const staffRepository = require('../repositories/staff.repository');
const { hashPassword } = require('../utils/bcrypt.util');
const { STAFF_ROLES, PAGINATION } = require('../config/constants');
const {
  ValidationError,
  NotFoundError,
  ConflictError,
} = require('../utils/error.util');

const isPrivilegedRole = (position) =>
  position === STAFF_ROLES.ADMIN || position === STAFF_ROLES.MANAGER;

const toBasicStaff = (row) => ({
  id: row.id,
  full_name: row.full_name,
  assigned_area: row.assigned_area,
  position: row.position,
  status: row.status,
});

const toFullStaff = (row) => ({
  id: row.id,
  account_id: row.account_id,
  username: row.username,
  full_name: row.full_name,
  email: row.email,
  phone_number: row.phone_number,
  address: row.address,
  assigned_area: row.assigned_area,
  position: row.position,
  status: row.status,
  preferences: row.preferences,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

class StaffService {
  async getAll(query, requesterPosition) {
    const page = Math.max(parseInt(query.page || PAGINATION.DEFAULT_PAGE, 10), 1);
    const limit = Math.min(
      Math.max(parseInt(query.limit || PAGINATION.DEFAULT_LIMIT, 10), 1),
      PAGINATION.MAX_LIMIT
    );

    const filters = {
      position: query.role,
      status: query.status,
      search: query.search,
    };

    const { data, total } = await staffRepository.findAll(page, limit, filters);

    const canSeeAll = isPrivilegedRole(requesterPosition);
    const items = data.map((row) => (canSeeAll ? toFullStaff(row) : toBasicStaff(row)));

    return {
      items,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async getById(id, requesterPosition) {
    const staff = await staffRepository.findByIdWithAccount(id);
    if (!staff) {
      throw new NotFoundError('Staff not found');
    }

    return isPrivilegedRole(requesterPosition) ? toFullStaff(staff) : toBasicStaff(staff);
  }

  async create(data) {
    const { username, password, full_name, email, role } = data;

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      throw new ValidationError('Username is required (min 3 characters)');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new ValidationError('Password is required (min 6 characters)');
    }

    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
      throw new ValidationError('Full name is required');
    }

    if (!role || typeof role !== 'string') {
      throw new ValidationError('Role is required');
    }

    const existingAccount = await accountRepository.findByUsername(username);
    if (existingAccount) {
      throw new ConflictError('Username already exists');
    }

    if (email) {
      const emailExists = await staffRepository.existsByEmail(email);
      if (emailExists) {
        throw new ConflictError('Email already exists');
      }
    }

    const hashedPassword = await hashPassword(password);
    const account = await accountRepository.create(username.trim(), hashedPassword);

    const staffData = {
      account_id: account.id,
      full_name: full_name.trim(),
      email: data.email,
      phone_number: data.phone_number,
      address: data.address,
      assigned_area: data.assigned_area,
      position: data.role,
      status: data.status || 'working',
    };

    const staff = await staffRepository.create(staffData);
    const staffWithAccount = await staffRepository.findByIdWithAccount(staff.id);

    return toFullStaff(staffWithAccount);
  }

  async update(id, data) {
    const current = await staffRepository.findById(id);
    if (!current) {
      throw new NotFoundError('Staff not found');
    }

    if (data.email && data.email !== current.email) {
      const emailExists = await staffRepository.existsByEmailExcludingId(
        data.email,
        id
      );
      if (emailExists) {
        throw new ConflictError('Email already exists');
      }
    }

    const staffData = {
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      address: data.address,
      assigned_area: data.assigned_area,
      position: data.role,
      status: data.status,
    };

    const updated = await staffRepository.update(id, staffData);
    const staffWithAccount = await staffRepository.findByIdWithAccount(updated.id);

    return toFullStaff(staffWithAccount);
  }

  async updateStatus(id, status) {
    if (!status || typeof status !== 'string') {
      throw new ValidationError('Status is required');
    }

    const updated = await staffRepository.update(id, { status });
    if (!updated) {
      throw new NotFoundError('Staff not found');
    }

    const staffWithAccount = await staffRepository.findByIdWithAccount(updated.id);
    return toFullStaff(staffWithAccount);
  }

  async updatePermissions(id, payload) {
    // Currently only supports role update. "permissions" is reserved for future use.
    const role = payload?.role;
    if (!role || typeof role !== 'string') {
      throw new ValidationError('role is required');
    }

    const updated = await staffRepository.update(id, { position: role });
    if (!updated) {
      throw new NotFoundError('Staff not found');
    }

    const staffWithAccount = await staffRepository.findByIdWithAccount(updated.id);
    return toFullStaff(staffWithAccount);
  }
}

module.exports = new StaffService();
