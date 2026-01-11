const clientRepository = require("../repositories/client.repository")
const staffRepository = require("../repositories/staff.repository")

class ClientService {
  async create(data) {

    const existingEmail = await clientRepository.findByEmail(data.email)
    if (existingEmail)
      throw new Error("Email already exists")

    const existingPhoneNumber = await clientRepository.findByPhoneNumber(data.phone_number)
    if (existingPhoneNumber)
      throw new Error("Phone number already exists")

    const res = await clientRepository.create(data)
    return {
      client: res?.toJSON()
    }
  }

  async getAll(query) {
    return await clientRepository.findAll(query);
  }

  async getById(clientId) {
    const client = await clientRepository.findById(clientId)

    const staff = await staffRepository.findById(client.staff_id)
    return {
      client: client?.toJSON(),
      staff: staff?.toJSON()
    }
  }

  async update(clientId, updateData) {
    const updatedClient = await clientRepository.updateById(clientId, updateData)

    const staff = await staffRepository.findById(updatedClient.staff_id)

    return {
      updated_client: updatedClient?.toJSON(),
      staff: staff?.toJSON()
    }
  }

  async delete(clientId) {
    const res = await clientRepository.delete(clientId)

    return res ? true : false

  }
}

module.exports = new ClientService()