// src/services/audit.service.js

const pool = require('../config/database');

class AuditService {
  /**
   * Ghi audit log
   * @param {Object} params
   * @param {number} params.actorId - ID người thực hiện (staff_id)
   * @param {string} params.actionType - Loại hành động: create, update, delete, status_change, etc.
   * @param {string} params.targetType - Loại đối tượng: voucher, contract, real_estate, etc.
   * @param {number|null} params.targetId - ID đối tượng
   * @param {Object} params.details - Chi tiết hành động (JSON)
   * @param {string} params.ipAddress - IP address
   */
  async log({ actorId, actionType, targetType, targetId, details, ipAddress }) {
    try {
      const query = `
        INSERT INTO audit_log (actor_id, action_type, target_type, target_id, details, ip_address, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING id
      `;

      const result = await pool.query(query, [
        actorId,
        actionType,
        targetType,
        targetId,
        JSON.stringify(details || {}),
        ipAddress || null,
      ]);

      return result.rows[0];
    } catch (error) {
      // Log error but don't throw - audit logging shouldn't break main flow
      console.error('Audit log error:', error.message);
      return null;
    }
  }

  /**
   * Lấy audit logs cho một đối tượng
   */
  async getLogsForTarget(targetType, targetId, limit = 50) {
    const query = `
      SELECT 
        al.id,
        al.action_type,
        al.details,
        al.ip_address,
        al.created_at,
        s.id as actor_id,
        s.full_name as actor_name
      FROM audit_log al
      LEFT JOIN staff s ON al.actor_id = s.id
      WHERE al.target_type = $1 AND al.target_id = $2
      ORDER BY al.created_at DESC
      LIMIT $3
    `;

    const result = await pool.query(query, [targetType, targetId, limit]);
    return result.rows;
  }

  /**
   * Lấy audit logs của một user
   */
  async getLogsByActor(actorId, limit = 100) {
    const query = `
      SELECT 
        al.id,
        al.action_type,
        al.target_type,
        al.target_id,
        al.details,
        al.ip_address,
        al.created_at
      FROM audit_log al
      WHERE al.actor_id = $1
      ORDER BY al.created_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [actorId, limit]);
    return result.rows;
  }
}

module.exports = new AuditService();
