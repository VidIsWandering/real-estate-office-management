/**
 * Client Service - Business logic cho quản lý khách hàng
 */

const clientRepository = require('../repositories/client.repository');
const { PAGINATION, STAFF_ROLES } = require('../config/constants');
const {
  ValidationError,
  NotFoundError,
  ConflictError,
} = require('../utils/error.util');

const isPrivilegedRole = (position) =>
  position === STAFF_ROLES.ADMIN || position === STAFF_ROLES.MANAGER;

class ClientService {
  async getAll(query) {
    const page = Math.max(parseInt(query.page || PAGINATION.DEFAULT_PAGE, 10), 1);
    const limit = Math.min(
      Math.max(parseInt(query.limit || PAGINATION.DEFAULT_LIMIT, 10), 1),
      PAGINATION.MAX_LIMIT
    );

    const filters = {
      type: query.type,
      staff_id: query.staff_id ? Number(query.staff_id) : undefined,
      search: query.search,
    };

    // Optional filter to include inactive
    if (query.is_active === 'true') filters.is_active = true;
    if (query.is_active === 'false') filters.is_active = false;

    const { data, total } = await clientRepository.findAll(page, limit, filters);

    return {
      items: data,
      pagination: { page, limit, total },
    };
  }

  async getById(id) {
    const client = await clientRepository.findById(id);
    if (!client) {
      throw new NotFoundError('Client not found');
    }
    return client;
  }

  async create(payload, user) {
    const full_name = payload?.full_name;
    const type = payload?.type;

    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
      throw new ValidationError('full_name is required');
    }

    if (!type || typeof type !== 'string') {
      throw new ValidationError('type is required');
    }

    if (payload?.email) {
      const exists = await clientRepository.existsByEmail(payload.email);
      if (exists) throw new ConflictError('Email already exists');
    }

    if (payload?.phone_number) {
      const exists = await clientRepository.existsByPhone(payload.phone_number);
      if (exists) throw new ConflictError('Phone number already exists');
    }

    const staffId =
      isPrivilegedRole(user?.position) && payload?.staff_id
        ? Number(payload.staff_id)
        : user?.staff_id;

    if (!staffId) {
      throw new ValidationError('staff_id is required');
    }

    return clientRepository.create({
      full_name: full_name.trim(),
      email: payload.email,
      phone_number: payload.phone_number,
      address: payload.address,
      type,
      referral_src: payload.referral_src,
      requirement: payload.requirement,
      staff_id: staffId,
      is_active:
        typeof payload.is_active === 'boolean'
          ? payload.is_active
          : payload.status
            ? String(payload.status).toLowerCase() === 'active'
            : undefined,
    });
  }

  async update(id, payload, user) {
    const current = await clientRepository.findById(id);
    if (!current) {
      throw new NotFoundError('Client not found');
    }

    if (payload?.email && payload.email !== current.email) {
      const exists = await clientRepository.existsByEmailExcludingId(
        payload.email,
        id
      );
      if (exists) throw new ConflictError('Email already exists');
    }

    if (payload?.phone_number && payload.phone_number !== current.phone_number) {
      const exists = await clientRepository.existsByPhoneExcludingId(
        payload.phone_number,
        id
      );
      if (exists) throw new ConflictError('Phone number already exists');
    }

    const staffId =
      isPrivilegedRole(user?.position) && payload?.staff_id
        ? Number(payload.staff_id)
        : undefined;

    const isActive =
      typeof payload.is_active === 'boolean'
        ? payload.is_active
        : payload.status
          ? String(payload.status).toLowerCase() === 'active'
          : undefined;

    const updated = await clientRepository.update(id, {
      full_name: payload.full_name,
      email: payload.email,
      phone_number: payload.phone_number,
      address: payload.address,
      type: payload.type,
      referral_src: payload.referral_src,
      requirement: payload.requirement,
      staff_id: staffId,
      is_active: isActive,
    });

    if (!updated) {
      throw new NotFoundError('Client not found');
    }

    return clientRepository.findById(id);
  }

  async delete(id) {
    const deleted = await clientRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundError('Client not found');
    }
    return deleted;
  }

  async getNotes(clientId, query) {
    const client = await clientRepository.findById(clientId);
    if (!client) throw new NotFoundError('Client not found');

    const page = Math.max(parseInt(query.page || 1, 10), 1);
    const limit = Math.min(Math.max(parseInt(query.limit || 20, 10), 1), 100);

    const { data, total } = await clientRepository.findNotes(clientId, page, limit);

    return {
      items: data,
      pagination: { page, limit, total },
    };
  }

  async addNote(clientId, payload, user) {
    const content = payload?.content;
    if (!content || typeof content !== 'string' || !content.trim()) {
      throw new ValidationError('content is required');
    }

    const client = await clientRepository.findById(clientId);
    if (!client) throw new NotFoundError('Client not found');

    if (!user?.staff_id) {
      throw new ValidationError('staff_id is required');
    }

    return clientRepository.addNote(clientId, user.staff_id, content.trim());
  }
}

module.exports = new ClientService();
