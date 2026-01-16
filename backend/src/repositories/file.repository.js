const { db } = require('../config/database');
const File = require('../models/file.model');

class FileRepository {
  /**
   * 📌 Tạo file mới
   * @param {Object} data
   * @returns {Promise<File>}
   */
  async create(data) {
    const sql = `
      INSERT INTO file (url, name, type, uploaded_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      data.url,
      data.name,
      data.type,
      data.uploaded_at || new Date(),
    ];

    const result = await db.query(sql, values);
    return new File(result.rows[0]);
  }

  /**
   * 📌 Lấy tất cả file
   * @returns {Promise<File[]>}
   */
  async findAll() {
    const sql = `
      SELECT *
      FROM file
      ORDER BY id DESC;
    `;

    const result = await db.query(sql);
    return result.rows.map((row) => new File(row));
  }

  /**
   * 📌 Lấy file theo id
   * @param {number} id
   * @returns {Promise<File|null>}
   */
  async findById(id) {
    const sql = `
      SELECT *
      FROM file
      WHERE id = $1;
    `;

    const result = await db.query(sql, [id]);
    if (result.rows.length === 0) return null;

    return new File(result.rows[0]);
  }

  async findByIds(ids = []) {
  if (ids.length === 0) return [];

  const sql = `
    SELECT *
    FROM file
    WHERE id = ANY($1);
  `;

  const result = await db.query(sql, [ids]);
  return result.rows.map(row => new File(row));
}


  /**
   * 📌 Cập nhật file (partial update)
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<File|null>}
   */
  async update(id, data) {
    const sql = `
      UPDATE file
      SET
        url = COALESCE($1, url),
        name = COALESCE($2, name),
        type = COALESCE($3, type),
        uploaded_at = COALESCE($4, uploaded_at)
      WHERE id = $5
      RETURNING *;
    `;

    const values = [data.url, data.name, data.type, data.uploaded_at, id];

    const result = await db.query(sql, values);
    if (result.rows.length === 0) return null;

    return new File(result.rows[0]);
  }

  /**
   * 📌 Xóa file theo id
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const sql = `
      DELETE FROM file
      WHERE id = $1
      RETURNING *;
    `;

    const result = await db.query(sql, [id]);
    return result.rows.length > 0;
  }
}

module.exports = new FileRepository();
