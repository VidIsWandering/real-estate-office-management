// import module db của bạn
const { db } = require('../config/database');
const RealEstatePriceHistory = require('../models/real-estate-price-history.model');
const RealEstateStatusHistory = require('../models/real-estate-status-history.model');
const RealEstate = require('../models/real-estate.model');

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
  async findAll(query) {
    const {
      page = 1,
      limit = 10,
      title,
      type,
      transaction_type,
      location,
      min_price,
      max_price,
      min_area,
      max_area,
      status,
      direction,
      staff_id,
      owner_id,
    } = query;

    const conditions = [];
    const values = [];

    // 🔹 Title search
    if (title) {
      values.push(`%${title}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    // 🔹 Type filter
    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    // 🔹 Transaction type filter
    if (transaction_type) {
      values.push(transaction_type);
      conditions.push(`transaction_type = $${values.length}`);
    }

    // 🔹 Location search
    if (location) {
      values.push(`%${location}%`);
      conditions.push(`location ILIKE $${values.length}`);
    }

    // 🔹 Direction search
    if (direction) {
      values.push(`${direction}`);
      conditions.push(`direction = $${values.length}`);
    }

    // 🔹 Price range
    if (min_price) {
      values.push(min_price);
      conditions.push(`price >= $${values.length}`);
    }
    if (max_price) {
      values.push(max_price);
      conditions.push(`price <= $${values.length}`);
    }

    // 🔹 Area range
    if (min_area) {
      values.push(min_area);
      conditions.push(`area >= $${values.length}`);
    }
    if (max_area) {
      values.push(max_area);
      conditions.push(`area <= $${values.length}`);
    }

    // 🔹 Status filter
    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (owner_id) {
      values.push(owner_id);
      conditions.push(`owner_id = $${values.length}`);
    }

    if (staff_id) {
      values.push(staff_id);
      conditions.push(`staff_id = $${values.length}`);
    }

    // 🔹 Build WHERE clause
    const whereSQL =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 🔹 Pagination
    const offset = (page - 1) * limit;

    // 🔹 Query data
    const dataSQL = `
    SELECT *
    FROM real_estate
    ${whereSQL}
    ORDER BY id DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2};
  `;

    // 🔹 Query total
    const countSQL = `
    SELECT COUNT(*) as total
    FROM real_estate
    ${whereSQL};
  `;

    const dataResult = await db.query(dataSQL, [...values, limit, offset]);
    const countResult = await db.query(countSQL, values);

    return {
      items: dataResult.rows.map((row) => new RealEstate(row)),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(countResult.rows[0].total),
        totalPages: Math.ceil(countResult.rows[0].total / limit),
      },
    };
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

 /**
 * Tìm real estate theo location
 * @param {string} location
 * @returns {Promise<RealEstate[]>}
 */
async findByLocation(location) {
  const sql = `
    SELECT *
    FROM real_estate
    WHERE location ILIKE $1
    ORDER BY id DESC;
  `;
  const values = [`%${location}%`]; // FIX: Thiếu dấu [ ở đây
  const result = await db.query(sql, values);
  return result.rows.map((row) => new RealEstate(row));
}

/**
 * Cập nhật status real estate
 */
async updateStatus(id, status) {
  const sql = `
    UPDATE real_estate
    SET status = $1
    WHERE id = $2
    RETURNING *;
  `;
  const result = await db.query(sql, [status, id]);
  if (result.rows.length === 0) return null;
  return new RealEstate(result.rows[0]);
}

/**
 * Thêm lịch sử status
 */
async addStatusHistory({ real_estate_id, old_status, new_status, reason, changed_by }) {
  const sql = `
    INSERT INTO real_estate_status_history
      (real_estate_id, old_status, new_status, reason, changed_by)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const result = await db.query(sql, [real_estate_id, old_status, new_status, reason || null, changed_by]);
  return new RealEstateStatusHistory(result.rows[0]);
}

/**
 * Thêm một bản ghi lịch sử giá cho bất động sản
 * @param {Object} param0 
 * @param {number} param0.real_estate_id - ID bất động sản
 * @param {number} param0.price - Giá mới
 * @param {number} param0.changed_by - ID staff thay đổi giá
 * @returns {Promise<RealEstatePriceHistory>}
 */
async addPriceHistory({ real_estate_id, price, changed_by }) {
  const sql = `
    INSERT INTO real_estate_price_history
      (real_estate_id, price, changed_by)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await db.query(sql, [real_estate_id, price, changed_by]);
  return new RealEstatePriceHistory(result.rows[0]);
}

/**
 * Lấy lịch sử giá
 */
async getPriceHistory(real_estate_id) {
  const sql = `
    SELECT * FROM real_estate_price_history
    WHERE real_estate_id = $1
    ORDER BY changed_at DESC;
  `;
  const result = await db.query(sql, [real_estate_id]);
  return result.rows.map(row => new RealEstatePriceHistory(row));
}

module.exports = new RealEstateRepository();
