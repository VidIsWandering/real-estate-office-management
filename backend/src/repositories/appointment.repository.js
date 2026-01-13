const { db } = require("../config/database");
const Appointment = require("../models/appointment.model");



class AppointmentRepository {
  /**
   * Create appointment
   */
  async create(data) {
    const sql = `
      INSERT INTO appointment
        (real_estate_id, client_id, staff_id, start_time, end_time, location, status, note)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;

    const result = await db.query(sql, [
      data.real_estate_id,
      data.client_id,
      data.staff_id,
      data.start_time,
      data.end_time,
      data.location || null,
      data.status || 'created',
      data.note || null,
    ]);

    return new Appointment(result.rows[0]);
  }

  /**
   * Get all appointments (optional filters)
   */
  async findAll(query = {}) {
    const {
      real_estate_id,
      client_id,
      staff_id,
      status,
      from_time,
      to_time,
      page = 1,
      limit = 10,
    } = query;

    const conditions = [];
    const values = [];

    if (real_estate_id) {
      values.push(real_estate_id);
      conditions.push(`real_estate_id = $${values.length}`);
    }

    if (client_id) {
      values.push(client_id);
      conditions.push(`client_id = $${values.length}`);
    }

    if (staff_id) {
      values.push(staff_id);
      conditions.push(`staff_id = $${values.length}`);
    }

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (from_time) {
      values.push(from_time);
      conditions.push(`start_time >= $${values.length}`);
    }

    if (to_time) {
      values.push(to_time);
      conditions.push(`end_time <= $${values.length}`);
    }

    const whereSQL =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 🔹 Pagination
    const offset = (Number(page) - 1) * Number(limit);

    // 🔹 Query data
    const dataSQL = `
    SELECT *
    FROM appointment
    ${whereSQL}
    ORDER BY start_time ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2};
  `;

    // 🔹 Query total
    const countSQL = `
    SELECT COUNT(*) AS total
    FROM appointment
    ${whereSQL};
  `;

    const dataResult = await db.query(dataSQL, [
      ...values,
      limit,
      offset,
    ]);

    const countResult = await db.query(countSQL, values);

    return {
      items: dataResult.rows.map(row => new Appointment(row)),

      total: Number(countResult.rows[0].total),


    };
  }


  /**
   * Get appointment by id
   */
  async findById(id) {
    const sql = `SELECT * FROM appointment WHERE id = $1;`;
    const result = await db.query(sql, [id]);
    if (result.rows.length === 0) return null;
    return new Appointment(result.rows[0]);
  }

  /**
   * Update appointment
   */
  async update(id, data) {
    const sql = `
      UPDATE appointment
      SET
        real_estate_id = COALESCE($1, real_estate_id),
        client_id = COALESCE($2, client_id),
        staff_id = COALESCE($3, staff_id),
        start_time = COALESCE($4, start_time),
        end_time = COALESCE($5, end_time),
        location = COALESCE($6, location),
        status = COALESCE($7, status),
        note = COALESCE($8, note)
      WHERE id = $9
      RETURNING *;
    `;

    const result = await db.query(sql, [
      data.real_estate_id,
      data.client_id,
      data.staff_id,
      data.start_time,
      data.end_time,
      data.location,
      data.status,
      data.note,
      id,
    ]);

    if (result.rows.length === 0) return null;
    return new Appointment(result.rows[0]);
  }

  /**
   * Delete appointment
   */
  async delete(id) {
    const sql = `
      DELETE FROM appointment
      WHERE id = $1
      RETURNING *;
    `;
    const result = await db.query(sql, [id]);
    return result.rows.length > 0;
  }

  async checkScheduleConflict({ staff_id, start_time, end_time, exclude_id }) {
    const conditions = [
      `staff_id = $1`,
      `start_time < $3`,
      `end_time > $2`,
    ];

    const values = [staff_id, start_time, end_time];

    if (exclude_id) {
      conditions.push(`id != $4`);
      values.push(exclude_id);
    }

    const sql = `
    SELECT 1
    FROM appointment
    WHERE ${conditions.join(" AND ")}
    LIMIT 1;
  `;

    const result = await db.query(sql, values);
    return result.rows.length > 0;
  }

}

module.exports = new AppointmentRepository();
