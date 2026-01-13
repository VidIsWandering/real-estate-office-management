const clientNoteRepository = require('../repositories/client-note.repository');
const clientRepository = require('../repositories/client.repository');
const staffRepository = require('../repositories/staff.repository');

class ClientService {
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

  async getAll(query) {
    return await clientRepository.findAll(query);
  }

  async getById(clientId) {
    const client = await clientRepository.findById(clientId);

    const staff = await staffRepository.findById(client.staff_id);
    return {
      client: client?.toJSON(),
      staff: staff?.toJSON(),
    };
  }

  async update(clientId, updateData) {
    const updatedClient = await clientRepository.updateById(
      clientId,
      updateData
    );

    const staff = await staffRepository.findById(updatedClient.staff_id);

    return {
      updated_client: updatedClient?.toJSON(),
      staff: staff?.toJSON(),
    };
  }

  async delete(clientId) {
    const res = await clientRepository.delete(clientId);

    return res ? true : false;
  }

  async addNote(data) {
    const res = await clientNoteRepository.create(data);
    const client = await clientRepository.findById(data.client_id);
    const staff = await staffRepository.findById(data.staff_id);
    return {
      client_note: res.toJSON(),
      client: client.toJSON(),
      staff: staff.toJSON(),
    };
  }

  async getNotes(query) {
    const res = await clientNoteRepository.findAll(query);
    return res;
  }
}

module.exports = new ClientService();
