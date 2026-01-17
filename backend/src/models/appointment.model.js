class Appointment {
  constructor(data) {
    this.id = data.id;
    this.real_estate_id = data.real_estate_id;
    this.client_id = data.client_id;
    this.staff_id = data.staff_id;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.location = data.location;
    this.status = data.status;
    this.note = data.note;
  }

  toJSON() {
    return {
      id: this.id,
      real_estate_id: this.real_estate_id,
      client_id: this.client_id,
      staff_id: this.staff_id,
      start_time: this.start_time,
      end_time: this.end_time,
      location: this.location,
      status: this.status,
      note: this.note,
    };
  }
}

module.exports = Appointment;
