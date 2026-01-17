/**
 * Client Repository - Tương tác với database
 */

const { db } = require('../config/database');
const Client = require('../models/client.model');

class ClientRepository {
  /**
   * Tạo client mới
   */
  async create(client) {
    const data = client.toJSON ? client.toJSON() : client;

    const sql = `
      INSERT INTO client (
        full_name,
        email,
        phone_number,
        address,
        type,
        referral_src,
        requirement,
        staff_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      data.full_name,
      data.email,
      data.phone_number,
      data.address,
      data.type,
      data.referral_src,
      data.requirement,
      data.staff_id,
    ];

    const result = await db.query(sql, values);
    return new Client(result.rows[0]);
  }

  /**
   * Lấy danh sách client + filter + pagination
   * @param {Object} query
   */
  async findAll(query) {
    const {
      page = 1,
      limit = 10,
      full_name,
      email,
      phone_number,
      address,
      type,
      staff_id,
    } = query;

    const conditions = [];
    const values = [];

    if (full_name) {
      values.push(`%${full_name}%`);
      conditions.push(`full_name ILIKE $${values.length}`);
    }

    if (email) {
      values.push(`%${email}%`);
      conditions.push(`email ILIKE $${values.length}`);
    }

    if (phone_number) {
      values.push(`%${phone_number}%`);
      conditions.push(`phone_number ILIKE $${values.length}`);
    }

    if (address) {
      values.push(`%${address}%`);
      conditions.push(`address ILIKE $${values.length}`);
    }

    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    if (staff_id) {
      // 🔹 Filter staff_id
      values.push(staff_id);
      conditions.push(`staff_id = $${values.length}`);
    }

    if (staff_id) {
      // 🔹 Filter staff_id
      values.push(staff_id);
      conditions.push(`staff_id = $${values.length}`);
    }

    const whereSQL =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const offset = (page - 1) * limit;

    // 🔢 Query data
    const dataSQL = `
    SELECT *
    FROM client
    ${whereSQL}
    ORDER BY id DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

    // 🔢 Query total
    const countSQL = `
    SELECT COUNT(*) 
    FROM client
    ${whereSQL}
  `;

    const dataResult = await db.query(dataSQL, [...values, limit, offset]);
    const countResult = await db.query(countSQL, values);

    return {
      items: dataResult.rows.map((row) => new Client(row)),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(countResult.rows[0].count),
        totalPages: Math.ceil(countResult.rows[0].count / limit),
      },
    };
  }

  /**
   * Tìm client theo id
   */
  async findById(id) {
    const sql = `
      SELECT * FROM client
      WHERE id = $1
    `;
    const result = await db.query(sql, [id]);
    if (result.rows.length === 0) return null;
    return new Client(result.rows[0]);
  }

  /**
   * Update client theo id
   */
  async updateById(id, updateData) {
    const sql = `
  UPDATE client
  SET
    full_name    = COALESCE($1, full_name),
    email        = COALESCE($2, email),
    phone_number = COALESCE($3, phone_number),
    address      = COALESCE($4, address),
    type         = COALESCE($5, type),
    referral_src = COALESCE($6, referral_src),
    requirement  = COALESCE($7, requirement),
    staff_id     = COALESCE($8, staff_id)
  WHERE id = $9
  RETURNING *
`;

    const values = [
      updateData.full_name,
      updateData.email,
      updateData.phone_number,
      updateData.address,
      updateData.type,
      updateData.referral_src,
      updateData.requirement,
      updateData.staff_id,
      id,
    ];

    const result = await db.query(sql, values);
    if (result.rows.length === 0) return null;
    return new Client(result.rows[0]);
  }

  /**
   * Xóa client
   */
  async delete(id) {
    const sql = `
      DELETE FROM client
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(sql, [id]);
    return result.rowCount > 0;
  }

  async findByStaffId(staffId) {
    const sql = `
    SELECT * FROM client
    WHERE staff_id = $1
    ORDER BY id DESC
  `;
    const result = await db.query(sql, [staffId]);
    return result.rows.map((row) => new Client(row));
  }

  /**
   * Tìm client theo email
   */
  async findByEmail(email) {
    const sql = `
      SELECT * FROM client
      WHERE email = $1
      LIMIT 1
    `;
    const result = await db.query(sql, [email]);
    if (result.rows.length === 0) return null;
    return new Client(result.rows[0]);
  }

  /**
   * Tìm client theo số điện thoại
   */
  async findByPhoneNumber(phoneNumber) {
    const sql = `
      SELECT * FROM client
      WHERE phone_number = $1
      LIMIT 1
    `;
    const result = await db.query(sql, [phoneNumber]);
    if (result.rows.length === 0) return null;
    return new Client(result.rows[0]);
  }
}

module.exports = new ClientRepository();
