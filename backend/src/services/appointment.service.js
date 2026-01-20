const { STAFF_ROLES, APPOINTMENT_STATUS } = require('../config/constants');
const appointmentRepository = require('../repositories/appointment.repository');
const clientRepository = require('../repositories/client.repository');
const realEstateRepository = require('../repositories/real-estate.repository');
const staffRepository = require('../repositories/staff.repository');

class AppointmentService {
  /**
   * GET ALL appointments
   * - Agent: chỉ xem lịch của mình
   * - Manager: xem tất cả
   */
  async getAll(query, user) {
    const filters = { ...query };

    // Agent chỉ xem lịch của mình
    if (user.position === STAFF_ROLES.AGENT) {
      filters.staff_id = user.staff_id;
    }

    return await appointmentRepository.findAll(filters);
  }

  /**
   * GET appointment by ID
   */
  async getById(id, user) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) throw new Error('Appointment not found');

    // Agent chỉ xem được lịch của mình
    if (
      user.position === STAFF_ROLES.AGENT &&
      appointment.staff_id !== user.staff_id
    ) {
      throw new Error('Access denied');
    }

    const realEstate = await realEstateRepository.findById(
      appointment.real_estate_id
    );
    const client = await clientRepository.findById(appointment.client_id);
    const staff = await staffRepository.findById(appointment.staff_id);

    return {
      real_estate: realEstate.toJSON(),
      client: client.toJSON(),
      staff: staff.toJSON(),
      appointment: appointment.toJSON(),
    };
  }

  /**
   * CREATE appointment
   * - Check entity tồn tại
   * - Check trùng lịch
   */
  async create(data, user) {
    const { real_estate_id, client_id, start_time, end_time } = data;

    const realEstate = await realEstateRepository.findById(real_estate_id);
    if (!realEstate) throw new Error('Real estate not found');

    const client = await clientRepository.findById(client_id);
    if (!client) throw new Error('Client not found');

    const staff = await staffRepository.findById(user.staff_id);
    if (!staff) throw new Error('Staff not found');

    // Check trùng lịch
    const conflict = await appointmentRepository.checkScheduleConflict({
      staff_id: user.staff_id,
      start_time,
      end_time,
    });

    if (conflict) {
      throw new Error('Schedule conflict detected');
    }

    return await appointmentRepository.create({
      ...data,
      staff_id: user.staff_id,
      status: APPOINTMENT_STATUS.CREATED,
    });
  }

  /**
   * UPDATE appointment
   */
  async update(id, data, user) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) throw new Error('Appointment not found');

    // Agent chỉ sửa lịch của mình
    if (
      user.role === STAFF_ROLES.AGENT &&
      appointment.staff_id !== user.staff_id
    ) {
      throw new Error('Access denied');
    }

    // Nếu đổi thời gian → check trùng lịch
    if (data.start_time || data.end_time) {
      const conflict = await appointmentRepository.checkScheduleConflict({
        staff_id: appointment.staff_id,
        start_time: data.start_time || appointment.start_time,
        end_time: data.end_time || appointment.end_time,
        exclude_id: id,
      });

      if (conflict) {
        throw new Error('Schedule conflict detected');
      }
    }

    return await appointmentRepository.update(id, data);
  }

  /**
   * UPDATE appointment status
   */
  async updateStatus(id, status, result_note, user) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) throw new Error('Appointment not found');

    // Agent chỉ update lịch của mình
    if (
      user.role === STAFF_ROLES.AGENT &&
      appointment.staff_id !== user.staff_id
    ) {
      throw new Error('Access denied');
    }

    // Validate status transition
    const allowedTransitions = {
      [APPOINTMENT_STATUS.CREATED]: [
        APPOINTMENT_STATUS.CONFIRMED,
        APPOINTMENT_STATUS.CANCELLED,
      ],
      [APPOINTMENT_STATUS.CONFIRMED]: [
        APPOINTMENT_STATUS.COMPLETED,
        APPOINTMENT_STATUS.CANCELLED,
      ],
    };

    if (!allowedTransitions[appointment.status]?.includes(status)) {
      throw new Error(
        `Cannot change status from ${appointment.status} to ${status}`
      );
    }

    return await appointmentRepository.update(id, {
      status,
      note: result_note,
    });
  }
}

module.exports = new AppointmentService();
