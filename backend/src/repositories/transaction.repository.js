const { db } = require('../config/database');
const Transaction = require('../models/transaction.model');

class TransactionRepository {
  async create(data) {
    const sql = `
      INSERT INTO transaction
        (real_estate_id, client_id, staff_id, offer_price, terms, status, cancellation_reason)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
    `;

    const result = await db.query(sql, [
      data.real_estate_id,
      data.client_id,
      data.staff_id,
      data.offer_price,
      data.terms || [],
      data.status || 'negotiating',
      data.cancellation_reason || null,
    ]);

    return new Transaction(result.rows[0]);
  }

  async findById(id) {
    const result = await db.query(`SELECT * FROM transaction WHERE id = $1`, [
      id,
    ]);
    return result.rows.length ? new Transaction(result.rows[0]) : null;
  }

async findAll(query = {}) {
  const {
    real_estate_id,
    client_id,
    staff_id,
    status,
    min_price,
    max_price,
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

  if (min_price) {
    values.push(min_price);
    conditions.push(`offer_price >= $${values.length}`);
  }

  if (max_price) {
    values.push(max_price);
    conditions.push(`offer_price <= $${values.length}`);
  }

  const whereSQL =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  // 🔹 Query data
  const dataSQL = `
    SELECT *
    FROM transaction
    ${whereSQL}
    ORDER BY id DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2};
  `;

  // 🔹 Query total
  const countSQL = `
    SELECT COUNT(*)::int AS total
    FROM transaction
    ${whereSQL};
  `;

  const dataResult = await db.query(dataSQL, [
    ...values,
    limitNumber,
    offset,
  ]);

  const countResult = await db.query(countSQL, values);

  const total = countResult.rows[0].total;

  return {
    items: dataResult.rows.map(r => new Transaction(r)),

    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
}




  async findByStaffId(staffId) {
    const result = await db.query(
      `SELECT * FROM transaction WHERE staff_id = $1 ORDER BY id DESC`,
      [staffId]
    );
    return result.rows.map((r) => new Transaction(r));
  }

  async updateOfferPrice(id, offerPrice) {
    const result = await db.query(
      `UPDATE transaction SET offer_price = $1 WHERE id = $2 RETURNING *`,
      [offerPrice, id]
    );
    return result.rows.length ? new Transaction(result.rows[0]) : null;
  }

  async updateTerms(id, terms) {
    const result = await db.query(
      `UPDATE transaction SET terms = $1 WHERE id = $2 RETURNING *`,
      [terms, id]
    );
    return result.rows.length ? new Transaction(result.rows[0]) : null;
  }

  async updateStatus(id, status, reason = null) {
    const result = await db.query(
      `
      UPDATE transaction
      SET status = $1, cancellation_reason = $2
      WHERE id = $3
      RETURNING *
      `,
      [status, reason, id]
    );
    return result.rows.length ? new Transaction(result.rows[0]) : null;
  }
}

module.exports = new TransactionRepository();
