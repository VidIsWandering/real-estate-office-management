/**
 * Contract Repository - Tương tác với database
 */
const { db } = require('../config/database');
const Contract = require('../models/contract.model');

class ContractRepository {
  async create(contract) {
    const data = contract;
    const sql = `
      INSERT INTO contract (
        transaction_id, type, party_a, party_b, 
        total_value, deposit_amount, payment_terms, paid_amount,
        remaining_amount, signed_date, effective_date, expiration_date,
        attachments, status, staff_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    const values = [
      data.transaction_id,
      data.type,
      data.party_a,
      data.party_b,
      data.total_value,
      data.deposit_amount,
      data.payment_terms,
      data.paid_amount,
      data.remaining_amount,
      data.signed_date,
      data.effective_date,
      data.expiration_date,
      data.attachments,
      data.status,
      data.staff_id,
    ];

    const result = await db.query(sql, values);
    return new Contract(result.rows[0]);
  }

  async findAll(query) {
    const { page = 1, limit = 10, status, type, staff_id } = query;
    const conditions = [];
    const values = [];

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }
    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }
    if (staff_id) {
      values.push(staff_id);
      conditions.push(`staff_id = $${values.length}`);
    }

    const whereSQL =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const pageNum = Number(page || 1);
    const limitNum = Number(limit || 10);
    const offset = (pageNum - 1) * limitNum;

    const dataSQL = `
    SELECT *
    FROM contract
    ${whereSQL}
    ORDER BY id DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

    const countSQL = `
    SELECT COUNT(*)::int AS total
    FROM contract
    ${whereSQL}
  `;

    const dataResult = await db.query(dataSQL, [...values, limitNum, offset]);

    const countResult = await db.query(countSQL, values);
    const total = countResult.rows[0].total;

    return {
      items: dataResult.rows.map((row) => new Contract(row)),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async findById(id) {
    const sql = `SELECT * FROM contract WHERE id = $1`;
    const result = await db.query(sql, [id]);
    return result.rows.length > 0 ? new Contract(result.rows[0]) : null;
  }

  async updateById(id, updateData) {
    // Xử lý động việc update các trường dựa trên snake_case
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updateData)) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }

    values.push(id);
    const sql = `UPDATE contract SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await db.query(sql, values);
    return result.rows.length > 0 ? new Contract(result.rows[0]) : null;
  }
}

module.exports = new ContractRepository();
