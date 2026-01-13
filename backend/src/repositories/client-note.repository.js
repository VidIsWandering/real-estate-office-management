const { db } = require('../config/database');
const ClientNote = require('../models/client-note.model');

class ClientNoteRepository {
  /**
   * Tạo note mới
   * @param {Object} noteData
   * @returns {Promise<ClientNote>}
   */
  async create(noteData) {
    const sql = `
      INSERT INTO client_note (client_id, staff_id, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [noteData.client_id, noteData.staff_id, noteData.content];
    const result = await db.query(sql, values);
    return new ClientNote(result.rows[0]);
  }

  /**
   * Lấy tất cả note với filter theo client_id và khoảng thời gian
   * @param {Object} query
   * @param {number} query.client_id
   * @param {string} query.from - ISO date
   * @param {string} query.to - ISO date
   * @returns {Promise<{items: ClientNote[], total: number}>}
   */
  async findAll(query = {}) {
    const { client_id, from, to } = query;
    const conditions = [];
    const values = [];

    if (client_id) {
      values.push(client_id);
      conditions.push(`client_id = $${values.length}`);
    }

    if (from) {
      values.push(from);
      conditions.push(`created_at >= $${values.length}`);
    }

    if (to) {
      values.push(to);
      conditions.push(`created_at <= $${values.length}`);
    }

    const whereSQL =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT *
      FROM client_note
      ${whereSQL}
      ORDER BY created_at DESC;
    `;

    const result = await db.query(sql, values);
    return {
      items: result.rows.map((row) => new ClientNote(row)),
      total: result.rows.length,
    };
  }

  /**
   * Tìm note theo id
   * @param {number} id
   * @returns {Promise<ClientNote|null>}
   */
  async findById(id) {
    const sql = `SELECT * FROM client_note WHERE id = $1;`;
    const result = await db.query(sql, [id]);
    if (result.rows.length === 0) return null;
    return new ClientNote(result.rows[0]);
  }

  /**
   * Cập nhật note theo id
   * @param {number} id
   * @param {Object} updateData
   * @returns {Promise<ClientNote|null>}
   */
  async update(id, updateData) {
    const sql = `
      UPDATE client_note
      SET
        content = COALESCE($1, content)
      WHERE id = $2
      RETURNING *;
    `;
    const values = [updateData.content, id];
    const result = await db.query(sql, values);
    if (result.rows.length === 0) return null;
    return new ClientNote(result.rows[0]);
  }

  /**
   * Xóa note theo id
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const sql = `DELETE FROM client_note WHERE id = $1 RETURNING *;`;
    const result = await db.query(sql, [id]);
    return result.rows.length > 0;
  }
}

module.exports = new ClientNoteRepository();
