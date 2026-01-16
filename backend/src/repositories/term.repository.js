const { db } = require('../config/database');
const Term = require('../models/term.model');

class TermRepository {
  /**
   * Create term
   */
  async create(data) {
    const sql = `
      INSERT INTO term (title, description)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const result = await db.query(sql, [data.title, data.description || null]);

    return new Term(result.rows[0]);
  }

  /**
   * Get all terms
   */
  async findAll() {
    const sql = `
      SELECT *
      FROM term
      ORDER BY id DESC;
    `;

    const result = await db.query(sql);
    return result.rows.map((row) => new Term(row));
  }

  /**
   * Get term by id
   */
  async findById(id) {
    const sql = `SELECT * FROM term WHERE id = $1;`;
    const result = await db.query(sql, [id]);
    if (result.rows.length === 0) return null;
    return new Term(result.rows[0]);
  }

  /**
   * Update term
   */
  async update(id, data) {
    const sql = `
      UPDATE term
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        updated_at = now()
      WHERE id = $3
      RETURNING *;
    `;

    const result = await db.query(sql, [data.title, data.description, id]);

    if (result.rows.length === 0) return null;
    return new Term(result.rows[0]);
  }

  /**
   * Delete term
   */
  async delete(id) {
    const sql = `
      DELETE FROM term
      WHERE id = $1
      RETURNING *;
    `;

    const result = await db.query(sql, [id]);
    return result.rows.length > 0;
  }
}

module.exports = new TermRepository();
