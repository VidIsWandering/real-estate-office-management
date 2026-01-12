/**
 * System Config Repository - Database operations for system configuration
 */

const { db } = require('../config/database');

class SystemConfigRepository {
  /**
   * Get all configurations
   */
  async getAll() {
    const sql = `
      SELECT key, value, description, updated_at
      FROM system_config
      ORDER BY key
    `;
    const result = await db.query(sql);
    return result.rows;
  }

  /**
   * Get configuration by key
   */
  async getByKey(key) {
    const sql = `
      SELECT key, value, description, updated_at
      FROM system_config
      WHERE key = $1
    `;
    const result = await db.query(sql, [key]);
    return result.rows[0] || null;
  }

  /**
   * Update configuration
   */
  async update(key, value, updatedBy) {
    const sql = `
      UPDATE system_config
      SET 
        value = $1::jsonb,
        updated_by = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE key = $3
      RETURNING key, value, description, updated_at
    `;
    const result = await db.query(sql, [JSON.stringify(value), updatedBy, key]);
    return result.rows[0] || null;
  }

  /**
   * Insert or update configuration
   */
  async upsert(key, value, description, updatedBy) {
    const sql = `
      INSERT INTO system_config (key, value, description, updated_by)
      VALUES ($1, $2::jsonb, $3, $4)
      ON CONFLICT (key) 
      DO UPDATE SET 
        value = $2::jsonb,
        description = COALESCE($3, system_config.description),
        updated_by = $4,
        updated_at = CURRENT_TIMESTAMP
      RETURNING key, value, description, updated_at
    `;
    const result = await db.query(sql, [
      key,
      JSON.stringify(value),
      description,
      updatedBy,
    ]);
    return result.rows[0];
  }

  /**
   * Get merged system configuration
   */
  async getMergedConfig() {
    const configs = await this.getAll();
    const merged = {};

    for (const config of configs) {
      if (config.key === 'company_info') {
        Object.assign(merged, config.value);
      } else if (config.key === 'business_config') {
        Object.assign(merged, config.value);
      } else if (config.key === 'notification_settings') {
        merged.notification_settings = config.value;
      }
    }

    return merged;
  }
}

module.exports = new SystemConfigRepository();
