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

  async findAll() {
    const result = await db.query(`SELECT * FROM transaction ORDER BY id DESC`);
    return result.rows.map((r) => new Transaction(r));
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
