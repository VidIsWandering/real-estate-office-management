/**
 * Catalog Repository - Database operations for config catalogs
 */

const { db } = require('../config/database');
const { NotFoundError, ConflictError } = require('../utils/error.util');
class CatalogRepository {
  /**
   * Get all catalogs by type
   * @param {string} type - property_type, area, lead_source, contract_type
   */
  async findByType(type) {
    const sql = `
      SELECT id, type, value, display_order, is_active, created_at, updated_at
      FROM config_catalog
      WHERE type = $1 AND is_active = TRUE
      ORDER BY display_order ASC, id ASC
    `;
    const result = await db.query(sql, [type]);
    return result.rows;
  }

  /**
   * Get catalog by ID
   */
  async findById(id) {
    const sql = `
      SELECT id, type, value, display_order, is_active, created_at, updated_at
      FROM config_catalog
      WHERE id = $1
    `;
    const result = await db.query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Check if value exists for type
   */
  async existsByTypeAndValue(type, value, excludeId = null) {
    let sql = `
      SELECT COUNT(*) as count
      FROM config_catalog
      WHERE type = $1 AND LOWER(value) = LOWER($2)
    `;
    const params = [type, value];

    if (excludeId) {
      sql += ` AND id != $3`;
      params.push(excludeId);
    }

    const result = await db.query(sql, params);
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Create new catalog item
   */
  async create(type, value, createdBy) {
    try {
      const sql = `
        INSERT INTO config_catalog (type, value, display_order, created_by, updated_by)
        VALUES ($1, $2, 999, $3, $3)
        RETURNING id, type, value, display_order, is_active, created_at, updated_at
      `;
      const result = await db.query(sql, [type, value, createdBy]);
      return result.rows[0];
    } catch (error) {
      // Handle unique constraint violation (23505)
      if (error.code === '23505') {
        throw new ConflictError(`Value "${value}" already exists for ${type}`);
      }
      throw error;
    }
  }

  /**
   * Update catalog item
   */
  async update(id, value, updatedBy) {
    try {
      const sql = `
        UPDATE config_catalog
        SET 
          value = $1,
          updated_by = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3 AND is_active = true
        RETURNING id, type, value, display_order, is_active, created_at, updated_at
      `;
      const result = await db.query(sql, [value, updatedBy, id]);

      if (!result.rows[0]) {
        throw new NotFoundError('Catalog item not found');
      }

      return result.rows[0];
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        throw new ConflictError(`Value "${value}" already exists`);
      }
      throw error;
    }
  }

  /**
   * Soft delete (set is_active = false)
   */
  async delete(id, updatedBy) {
    const sql = `
      UPDATE config_catalog
      SET 
        is_active = FALSE,
        updated_by = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND is_active = true
      RETURNING id
    `;
    const result = await db.query(sql, [updatedBy, id]);

    if (!result.rows[0]) {
      throw new NotFoundError('Catalog item not found');
    }

    return true;
  }

  /**
   * Reorder catalog items
   */
  async updateOrder(items) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      for (const item of items) {
        await client.query(
          'UPDATE config_catalog SET display_order = $1 WHERE id = $2',
          [item.display_order, item.id]
        );
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new CatalogRepository();
