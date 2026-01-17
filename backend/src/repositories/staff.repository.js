/**
 * Staff Repository - Database interactions for staff
 */

const { db } = require('../config/database');
const Staff = require('../models/staff.model');

class StaffRepository {
  /**
   * Create new staff
   */
  async create(staffData) {
    const sql = `
      INSERT INTO staff (
        account_id, full_name, email, phone_number, 
        address, assigned_area, position, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      staffData.account_id,
      staffData.full_name,
      staffData.email || null,
      staffData.phone_number || null,
      staffData.address || null,
      staffData.assigned_area || null,
      staffData.position || 'agent',
      staffData.status || 'working',
    ];

    const result = await db.query(sql, values);
    return new Staff(result.rows[0]);
  }

  /**
   * Find staff by account_id
   */
  async findByAccountId(accountId) {
    const sql = `
      SELECT * FROM staff
      WHERE account_id = $1
    `;
    const result = await db.query(sql, [accountId]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Staff(result.rows[0]);
  }

  /**
   * Find staff by id
   */
  async findById(id) {
    const sql = `
      SELECT * FROM staff
      WHERE id = $1
    `;
    const result = await db.query(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Staff(result.rows[0]);
  }

  /**
   * Find staff with account information
   */
  async findByIdWithAccount(id) {
    const sql = `
      SELECT 
        s.*,
        a.username,
        a.created_at as account_created_at
      FROM staff s
      INNER JOIN account a ON s.account_id = a.id
      WHERE s.id = $1
    `;
    const result = await db.query(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  /**
   * Check if email exists
   */
  async existsByEmail(email) {
    const sql = `
      SELECT EXISTS(SELECT 1 FROM staff WHERE email = $1) as exists
    `;
    const result = await db.query(sql, [email]);
    return result.rows[0].exists;
  }

  /**
   * Update staff
   */
  async update(id, staffData) {
    const sql = `
      UPDATE staff
      SET 
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        phone_number = COALESCE($3, phone_number),
        address = COALESCE($4, address),
        assigned_area = COALESCE($5, assigned_area),
        position = COALESCE($6, position),
        status = COALESCE($7, status),
        preferences = COALESCE($8, preferences)
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      staffData.full_name,
      staffData.email,
      staffData.phone_number,
      staffData.address,
      staffData.assigned_area,
      staffData.position,
      staffData.status,
      staffData.preferences ? JSON.stringify(staffData.preferences) : null,
      id,
    ];

    const result = await db.query(sql, values);

    if (result.rows.length === 0) {
      return null;
    }

    return new Staff(result.rows[0]);
  }

  /**
   * Get all staff with pagination and filters
   */
  async findAll(page = 1, limit = 10, filters = {}) {
    let sql = `
      SELECT 
        s.*,
        a.username
      FROM staff s
      INNER JOIN account a ON s.account_id = a.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 0;

    // Apply filters
    if (filters.position) {
      paramCount++;
      sql += ` AND s.position = $${paramCount}`;
      values.push(filters.position);
    }

    if (filters.status) {
      paramCount++;
      sql += ` AND s.status = $${paramCount}`;
      values.push(filters.status);
    }

    if (filters.search) {
      paramCount++;
      sql += ` AND (s.full_name ILIKE $${paramCount} OR s.email ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
    }

    // Count total
    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as filtered`;
    const countResult = await db.query(countSql, values);
    const total = parseInt(countResult.rows[0].total);

    // Add pagination
    const offset = (page - 1) * limit;
    paramCount++;
    sql += ` ORDER BY s.id DESC LIMIT $${paramCount}`;
    values.push(limit);

    paramCount++;
    sql += ` OFFSET $${paramCount}`;
    values.push(offset);

    const result = await db.query(sql, values);

    return {
      data: result.rows,
      total,
    };
  }
}

module.exports = new StaffRepository();
