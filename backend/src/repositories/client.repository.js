/**
 * Client Repository - Tương tác với database
 */

const { db } = require('../config/database');

class ClientRepository {
  async create(data) {
    const sql = `
      INSERT INTO client (
        full_name,
        email,
        phone_number,
        address,
        type,
        referral_src,
        requirement,
        staff_id,
        is_active
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `;

    const values = [
      data.full_name,
      data.email || null,
      data.phone_number || null,
      data.address || null,
      data.type,
      data.referral_src || null,
      data.requirement || null,
      data.staff_id || null,
      typeof data.is_active === 'boolean' ? data.is_active : true,
    ];

    const result = await db.query(sql, values);
    return result.rows[0];
  }

  async findById(id) {
    const sql = `
      SELECT
        c.*,
        s.full_name AS staff_name
      FROM client c
      LEFT JOIN staff s ON c.staff_id = s.id
      WHERE c.id = $1
    `;

    const result = await db.query(sql, [id]);
    return result.rows[0] || null;
  }

  async existsByEmail(email) {
    const sql = `SELECT EXISTS(SELECT 1 FROM client WHERE email = $1) as exists`;
    const result = await db.query(sql, [email]);
    return result.rows[0].exists;
  }

  async existsByPhone(phoneNumber) {
    const sql = `SELECT EXISTS(SELECT 1 FROM client WHERE phone_number = $1) as exists`;
    const result = await db.query(sql, [phoneNumber]);
    return result.rows[0].exists;
  }

  async existsByEmailExcludingId(email, id) {
    const sql = `
      SELECT EXISTS(
        SELECT 1 FROM client
        WHERE email = $1 AND id <> $2
      ) as exists
    `;
    const result = await db.query(sql, [email, id]);
    return result.rows[0].exists;
  }

  async existsByPhoneExcludingId(phoneNumber, id) {
    const sql = `
      SELECT EXISTS(
        SELECT 1 FROM client
        WHERE phone_number = $1 AND id <> $2
      ) as exists
    `;
    const result = await db.query(sql, [phoneNumber, id]);
    return result.rows[0].exists;
  }

  async update(id, data) {
    const sql = `
      UPDATE client
      SET
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        phone_number = COALESCE($3, phone_number),
        address = COALESCE($4, address),
        type = COALESCE($5, type),
        referral_src = COALESCE($6, referral_src),
        requirement = COALESCE($7, requirement),
        staff_id = COALESCE($8, staff_id),
        is_active = COALESCE($9, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
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
      typeof data.is_active === 'boolean' ? data.is_active : null,
      id,
    ];

    const result = await db.query(sql, values);
    return result.rows[0] || null;
  }

  async softDelete(id) {
    const sql = `
      UPDATE client
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await db.query(sql, [id]);
    return result.rows[0] || null;
  }

  async findAll(page = 1, limit = 10, filters = {}) {
    let sql = `
      SELECT
        c.*,
        s.full_name AS staff_name
      FROM client c
      LEFT JOIN staff s ON c.staff_id = s.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 0;

    if (filters.type) {
      paramCount++;
      sql += ` AND c.type = $${paramCount}`;
      values.push(filters.type);
    }

    if (filters.staff_id) {
      paramCount++;
      sql += ` AND c.staff_id = $${paramCount}`;
      values.push(filters.staff_id);
    }

    if (typeof filters.is_active === 'boolean') {
      paramCount++;
      sql += ` AND c.is_active = $${paramCount}`;
      values.push(filters.is_active);
    }

    if (filters.search) {
      paramCount++;
      sql += ` AND (
        c.full_name ILIKE $${paramCount}
        OR c.email ILIKE $${paramCount}
        OR c.phone_number ILIKE $${paramCount}
      )`;
      values.push(`%${filters.search}%`);
    }

    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as filtered`;
    const countResult = await db.query(countSql, values);
    const total = parseInt(countResult.rows[0].total, 10);

    const offset = (page - 1) * limit;
    paramCount++;
    sql += ` ORDER BY c.id DESC LIMIT $${paramCount}`;
    values.push(limit);

    paramCount++;
    sql += ` OFFSET $${paramCount}`;
    values.push(offset);

    const result = await db.query(sql, values);

    return { data: result.rows, total };
  }

  async findNotes(clientId, page = 1, limit = 20) {
    let sql = `
      SELECT
        cn.id,
        cn.content,
        cn.created_at,
        cn.staff_id AS created_by,
        s.full_name AS created_by_name
      FROM client_note cn
      LEFT JOIN staff s ON cn.staff_id = s.id
      WHERE cn.client_id = $1
    `;

    const values = [clientId];

    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as filtered`;
    const countResult = await db.query(countSql, values);
    const total = parseInt(countResult.rows[0].total, 10);

    const offset = (page - 1) * limit;
    sql += ` ORDER BY cn.created_at DESC LIMIT $2 OFFSET $3`;
    values.push(limit, offset);

    const result = await db.query(sql, values);
    return { data: result.rows, total };
  }

  async addNote(clientId, staffId, content) {
    const sql = `
      INSERT INTO client_note (client_id, staff_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await db.query(sql, [clientId, staffId, content]);
    return result.rows[0];
  }
}

module.exports = new ClientRepository();
