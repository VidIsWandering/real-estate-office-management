/**
 * Permission Repository - Database operations for role permissions
 */

const { db } = require('../config/database');

class PermissionRepository {
  /**
   * Get all role permissions from database
   * @returns {Promise<Array>} Array of all permissions sorted by position, resource, permission
   */
  async findAll() {
    const sql = `
      SELECT 
        id, 
        position, 
        resource, 
        permission, 
        is_granted,
        updated_at
      FROM role_permission
      ORDER BY position, resource, permission
    `;
    const result = await db.query(sql);
    return result.rows;
  }

  /**
   * Get all permissions for a specific position (role)
   * @param {string} position - Position/role: agent, legal_officer, accountant
   * @returns {Promise<Array>} Array of permissions for the position
   */
  async findByPosition(position) {
    const sql = `
      SELECT 
        id, 
        position, 
        resource, 
        permission, 
        is_granted,
        updated_at
      FROM role_permission
      WHERE position = $1
      ORDER BY resource, permission
    `;
    const result = await db.query(sql, [position]);
    return result.rows;
  }

  /**
   * Find a specific permission by position, resource, and permission type
   * @param {string} position - Position/role
   * @param {string} resource - Resource name (transactions, contracts, etc.)
   * @param {string} permission - Permission type (view, add, edit, delete)
   * @returns {Promise<Object|null>} Permission record or null if not found
   */
  async findByPositionResourcePermission(position, resource, permission) {
    const sql = `
      SELECT 
        id, 
        position, 
        resource, 
        permission, 
        is_granted,
        updated_at
      FROM role_permission
      WHERE position = $1 AND resource = $2 AND permission = $3
    `;
    const result = await db.query(sql, [position, resource, permission]);
    return result.rows[0] || null;
  }

  /**
   * Insert or update a single permission (upsert)
   * @param {string} position - Position/role
   * @param {string} resource - Resource name
   * @param {string} permission - Permission type
   * @param {boolean} isGranted - Whether permission is granted
   * @param {number} updatedBy - Staff ID of updater
   * @returns {Promise<Object>} Upserted permission record
   */
  async upsert(position, resource, permission, isGranted, updatedBy) {
    const sql = `
      INSERT INTO role_permission (position, resource, permission, is_granted, updated_by)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (position, resource, permission)
      DO UPDATE SET
        is_granted = EXCLUDED.is_granted,
        updated_by = EXCLUDED.updated_by,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, position, resource, permission, is_granted, updated_at
    `;
    const result = await db.query(sql, [
      position,
      resource,
      permission,
      isGranted,
      updatedBy,
    ]);
    return result.rows[0];
  }

  /**
   * Bulk upsert multiple permissions in a transaction
   * @param {Array<{position, resource, permission, is_granted}>} permissions - Array of permission objects
   * @param {number} updatedBy - Staff ID of updater
   * @returns {Promise<Array>} Array of upserted permission records
   * @throws {Error} If transaction fails (automatically rolls back)
   */
  async bulkUpsert(permissions, updatedBy) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const results = [];
      for (const perm of permissions) {
        const result = await client.query(
          `INSERT INTO role_permission (position, resource, permission, is_granted, updated_by)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (position, resource, permission)
           DO UPDATE SET
             is_granted = EXCLUDED.is_granted,
             updated_by = EXCLUDED.updated_by,
             updated_at = CURRENT_TIMESTAMP
           RETURNING id, position, resource, permission, is_granted, updated_at`,
          [
            perm.position,
            perm.resource,
            perm.permission,
            perm.is_granted,
            updatedBy,
          ]
        );
        results.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Transform flat permissions to matrix format
   * Returns: { position: { resource: { view: bool, add: bool, edit: bool, delete: bool } } }
   */
  transformToMatrix(permissions) {
    const matrix = {};

    for (const perm of permissions) {
      if (!matrix[perm.position]) {
        matrix[perm.position] = {};
      }
      if (!matrix[perm.position][perm.resource]) {
        matrix[perm.position][perm.resource] = {};
      }
      matrix[perm.position][perm.resource][perm.permission] = perm.is_granted;
    }

    return matrix;
  }

  /**
   * Transform matrix format to flat permissions
   */
  transformToFlat(matrix) {
    const flat = [];

    for (const [position, resources] of Object.entries(matrix)) {
      for (const [resource, permissions] of Object.entries(resources)) {
        for (const [permission, isGranted] of Object.entries(permissions)) {
          flat.push({ position, resource, permission, is_granted: isGranted });
        }
      }
    }

    return flat;
  }
}

module.exports = new PermissionRepository();
