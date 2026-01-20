const { STAFF_ROLES } = require('../config/constants');
const clientNoteRepository = require('../repositories/client-note.repository');
const clientRepository = require('../repositories/client.repository');
const staffRepository = require('../repositories/staff.repository');

class ClientService {
  async getOptions(query) {
    const res = await clientRepository.findAll(query);
    return {
      items: res.items.map((c) => {
        const json = c.toJSON();
        return {
          id: json.id,
          full_name: json.full_name,
          phone_number: json.phone_number ?? null,
        };
      }),
      pagination: res.pagination,
    };
  }

  async create(data) {
    const existingEmail = await clientRepository.findByEmail(data.email);
    if (existingEmail) throw new Error('Email already exists');

    const existingPhoneNumber = await clientRepository.findByPhoneNumber(
      data.phone_number
    );
    if (existingPhoneNumber) throw new Error('Phone number already exists');

    const res = await clientRepository.create(data);
    return {
      client: res?.toJSON(),
    };
  }

  async getAll(query, user) {
    const canSeeAll =
      user.position === STAFF_ROLES.MANAGER ||
      user.position === STAFF_ROLES.ADMIN;

    if (!canSeeAll) {
      query.staff_id = user.staff_id;
    }
    return await clientRepository.findAll(query);
  }

  async getById(clientId, user) {
    const client = await clientRepository.findById(clientId);
    const staff = client?.staff_id
      ? await staffRepository.findById(client.staff_id)
      : null;

    const canManageAll =
      user.position === STAFF_ROLES.MANAGER ||
      user.position === STAFF_ROLES.ADMIN;

    if (!canManageAll && client.staff_id != user.staff_id) {
      throw new Error('You do not have permission to manage this customer');
    }
    return {
      client: client?.toJSON(),
      staff: staff?.toJSON(),
    };
  }

  async update(clientId, updateData, user) {
    const client = await clientRepository.findById(clientId);
    const staff = client?.staff_id
      ? await staffRepository.findById(client.staff_id)
      : null;

    const canManageAll =
      user.position === STAFF_ROLES.MANAGER ||
      user.position === STAFF_ROLES.ADMIN;
    if (!canManageAll && client.staff_id != user.staff_id) {
      throw new Error('You do not have permission to manage this customer');
    }
    const updatedClient = await clientRepository.updateById(
      clientId,
      updateData
    );
    return {
      updated_client: updatedClient?.toJSON(),
      staff: staff?.toJSON(),
    };
  }

  async delete(clientId, user) {
    const client = await clientRepository.findById(clientId);

    const canManageAll =
      user.position === STAFF_ROLES.MANAGER ||
      user.position === STAFF_ROLES.ADMIN;

    if (!canManageAll && client.staff_id != user.staff_id) {
      throw new Error('You do not have permission to manage this customer');
    }
    const res = await clientRepository.delete(clientId);

    return res ? true : false;
  }

  async addNote(data, user) {
    const client = await clientRepository.findById(data.client_id);
    const staff = await staffRepository.findById(data.staff_id);

    const canManageAll =
      user.position === STAFF_ROLES.MANAGER ||
      user.position === STAFF_ROLES.ADMIN;

    if (!canManageAll && client.staff_id != user.staff_id) {
      throw new Error('You do not have permission to manage this customer');
    }
    const res = await clientNoteRepository.create(data);
    return {
      client_note: res.toJSON(),
      client: client.toJSON(),
      staff: staff.toJSON(),
    };
  }

  async getNotes(query, user) {
    const client = await clientRepository.findById(query.client_id);

    const canManageAll =
      user.position === STAFF_ROLES.MANAGER ||
      user.position === STAFF_ROLES.ADMIN;

    if (!canManageAll && client.staff_id != user.staff_id) {
      throw new Error('You do not have permission to manage this customer');
    }
    const res = await clientNoteRepository.findAll(query);
    return res;
  }
}

module.exports = new ClientService();
