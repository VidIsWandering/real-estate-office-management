const db = require('../db'); // import module db của bạn
const RealEstate = require('../models/RealEstate');

class RealEstateRepository {
  /**
   * Tạo bản ghi mới
   * @param {Object} data - dữ liệu real estate
   * @returns {Promise<RealEstate>}
   */
  async create(data) {
    const sql = `
      INSERT INTO real_estate
        (title, type, transaction_type, location, price, area, description, direction, media_files, owner_id, legal_docs, staff_id, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *;
    `;
    const values = [
      data.title,
      data.type,
      data.transaction_type,
      data.location,
      data.price,
      data.area,
      data.description || null,
      data.direction || null,
      data.media_files || [],
      data.owner_id,
      data.legal_docs || [],
      data.staff_id,
      data.status || 'created',
    ];

    const result = await db.query(sql, values);
    return new RealEstate(result.rows[0]);
  }

  /**
   * Lấy tất cả bản ghi
   * @returns {Promise<RealEstate[]>}
   */
  async findAll() {
    const sql = `SELECT * FROM real_estate;`;
    const result = await db.query(sql);
    return result.rows.map(row => new RealEstate(row));
  }

  /**
   * Lấy bản ghi theo id
   * @param {number} id
   * @returns {Promise<RealEstate|null>}
   */
  async findById(id) {
    const sql = `SELECT * FROM real_estate WHERE id = $1;`;
    const result = await db.query(sql, [id]);
    if (result.rows.length === 0) return null;
    return new RealEstate(result.rows[0]);
  }

  /**
   * Cập nhật bản ghi theo id
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<RealEstate|null>}
   */
  async update(id, data) {
    const sql = `
      UPDATE real_estate
      SET
        title = COALESCE($1, title),
        type = COALESCE($2, type),
        transaction_type = COALESCE($3, transaction_type),
        location = COALESCE($4, location),
        price = COALESCE($5, price),
        area = COALESCE($6, area),
        description = COALESCE($7, description),
        direction = COALESCE($8, direction),
        media_files = COALESCE($9, media_files),
        owner_id = COALESCE($10, owner_id),
        legal_docs = COALESCE($11, legal_docs),
        staff_id = COALESCE($12, staff_id),
        status = COALESCE($13, status)
      WHERE id = $14
      RETURNING *;
    `;
    const values = [
      data.title,
      data.type,
      data.transaction_type,
      data.location,
      data.price,
      data.area,
      data.description,
      data.direction,
      data.media_files,
      data.owner_id,
      data.legal_docs,
      data.staff_id,
      data.status,
      id,
    ];

    const result = await db.query(sql, values);
    if (result.rows.length === 0) return null;
    return new RealEstate(result.rows[0]);
  }

  /**
   * Xóa bản ghi theo id
   * @param {number} id
   * @returns {Promise<boolean>} true nếu xóa thành công
   */
  async delete(id) {
    const sql = `DELETE FROM real_estate WHERE id = $1 RETURNING *;`;
    const result = await db.query(sql, [id]);
    return result.rows.length > 0;
  }
}

module.exports = RealEstateRepository;
