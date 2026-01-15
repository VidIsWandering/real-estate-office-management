/**
 * Security Repository - Database operations for security features
 */

const { db } = require('../config/database');
const crypto = require('crypto');

class SecurityRepository {
  /**
   * Create a new login session
   * @param {Object} sessionData - Session data
   * @returns {Promise<Object>} Created session
   */
  async createSession(sessionData) {
    const {
      account_id,
      refresh_token,
      ip_address,
      user_agent,
      device_info,
      expires_at,
    } = sessionData;

    // Hash token for security (store hash, not plain token)
    const token_hash = crypto
      .createHash('sha256')
      .update(refresh_token)
      .digest('hex');

    const sql = `
      INSERT INTO login_session (
        account_id, token_hash, ip_address, user_agent, 
        device_info, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, account_id, ip_address, user_agent, device_info, 
                last_activity, expires_at, is_active, created_at
    `;

    const result = await db.query(sql, [
      account_id,
      token_hash,
      ip_address,
      user_agent,
      device_info ? JSON.stringify(device_info) : null,
      expires_at,
    ]);

    return result.rows[0];
  }

  /**
   * Get all active sessions for an account
   * @param {number} accountId - Account ID
   * @returns {Promise<Array>} Array of active sessions
   */
  async getActiveSessions(accountId) {
    const sql = `
      SELECT 
        id, 
        ip_address, 
        user_agent, 
        device_info,
        last_activity, 
        expires_at, 
        created_at,
        CASE 
          WHEN last_activity > NOW() - INTERVAL '15 minutes' THEN true
          ELSE false
        END as is_current
      FROM login_session
      WHERE account_id = $1 
        AND is_active = TRUE 
        AND expires_at > NOW()
      ORDER BY last_activity DESC
    `;

    const result = await db.query(sql, [accountId]);
    return result.rows;
  }

  /**
   * Update session last activity
   * @param {string} tokenHash - Token hash
   * @returns {Promise<boolean>} Success status
   */
  async updateSessionActivity(tokenHash) {
    const sql = `
      UPDATE login_session
      SET last_activity = NOW()
      WHERE token_hash = $1 AND is_active = TRUE
      RETURNING id
    `;

    const result = await db.query(sql, [tokenHash]);
    return result.rows.length > 0;
  }

  /**
   * Revoke a session (logout)
   * @param {number} sessionId - Session ID
   * @param {number} accountId - Account ID (for authorization)
   * @returns {Promise<boolean>} Success status
   */
  async revokeSession(sessionId, accountId) {
    const sql = `
      UPDATE login_session
      SET is_active = FALSE
      WHERE id = $1 AND account_id = $2
      RETURNING id
    `;

    const result = await db.query(sql, [sessionId, accountId]);
    return result.rows.length > 0;
  }

  /**
   * Revoke all sessions for an account (except current)
   * @param {number} accountId - Account ID
   * @param {number} currentSessionId - Current session ID to keep
   * @returns {Promise<number>} Number of revoked sessions
   */
  async revokeAllSessions(accountId, currentSessionId = null) {
    let sql = `
      UPDATE login_session
      SET is_active = FALSE
      WHERE account_id = $1 AND is_active = TRUE
    `;

    const params = [accountId];

    if (currentSessionId) {
      sql += ` AND id != $2`;
      params.push(currentSessionId);
    }

    sql += ` RETURNING id`;

    const result = await db.query(sql, params);
    return result.rows.length;
  }

  /**
   * Clean up expired sessions
   * @returns {Promise<number>} Number of cleaned sessions
   */
  async cleanupExpiredSessions() {
    const sql = `
      UPDATE login_session
      SET is_active = FALSE
      WHERE is_active = TRUE AND expires_at < NOW()
      RETURNING id
    `;

    const result = await db.query(sql);
    return result.rows.length;
  }

  /**
   * Log login attempt to audit_log
   * @param {Object} loginData - Login attempt data
   * @returns {Promise<Object>} Created log entry
   */
  async logLoginAttempt(loginData) {
    const { account_id, action_type, status, ip_address, user_agent, details } =
      loginData;

    const sql = `
      INSERT INTO audit_log (
        actor_id, action_type, target_type, target_id,
        details, ip_address, user_agent, status
      )
      VALUES ($1, $2, 'account', $3, $4, $5, $6, $7)
      RETURNING id, actor_id, action_type, timestamp, status
    `;

    const result = await db.query(sql, [
      account_id,
      action_type,
      account_id,
      details ? JSON.stringify(details) : null,
      ip_address,
      user_agent,
      status,
    ]);

    return result.rows[0];
  }

  /**
   * Get login history for an account
   * @param {number} accountId - Account ID
   * @param {number} limit - Number of records to return
   * @returns {Promise<Array>} Array of login history
   */
  async getLoginHistory(accountId, limit = 50) {
    const sql = `
      SELECT 
        id,
        action_type,
        created_at as login_at,
        ip_address,
        user_agent,
        details
      FROM audit_log
      WHERE actor_id = $1 
        AND action_type IN ('login', 'logout')
      ORDER BY created_at DESC
      LIMIT $2
    `;

    const result = await db.query(sql, [accountId, limit]);
    return result.rows;
  }
}

module.exports = new SecurityRepository();
