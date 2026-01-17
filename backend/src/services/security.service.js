/**
 * Security Service - Business logic for security features
 */

const securityRepository = require('../repositories/security.repository');
const { NotFoundError, ValidationError } = require('../utils/error.util');

class SecurityService {
  /**
   * Get all active sessions for current user
   * @param {number} accountId - Account ID
   * @returns {Promise<Array>} Array of active sessions
   */
  async getSessions(accountId) {
    const sessions = await securityRepository.getActiveSessions(accountId);

    // Format sessions for frontend
    return sessions.map((session) => ({
      id: session.id,
      ip_address: session.ip_address,
      user_agent: session.user_agent,
      device_info: session.device_info,
      last_activity: session.last_activity,
      created_at: session.created_at,
      expires_at: session.expires_at,
      is_current: session.is_current,
    }));
  }

  /**
   * Revoke a specific session
   * @param {number} sessionId - Session ID
   * @param {number} accountId - Account ID
   * @returns {Promise<Object>} Success message
   */
  async revokeSession(sessionId, accountId) {
    const success = await securityRepository.revokeSession(
      sessionId,
      accountId
    );

    if (!success) {
      throw new NotFoundError('Session not found or already revoked');
    }

    return { message: 'Session revoked successfully' };
  }

  /**
   * Revoke all sessions except current one
   * @param {number} accountId - Account ID
   * @param {number} currentSessionId - Current session ID to keep
   * @returns {Promise<Object>} Number of revoked sessions
   */
  async revokeAllSessions(accountId, currentSessionId) {
    const count = await securityRepository.revokeAllSessions(
      accountId,
      currentSessionId
    );

    return {
      message: `${count} session(s) revoked successfully`,
      count,
    };
  }

  /**
   * Get login history
   * @param {number} accountId - Account ID
   * @param {number} limit - Number of records
   * @returns {Promise<Array>} Login history
   */
  async getLoginHistory(accountId, limit = 50) {
    if (limit > 100) {
      throw new ValidationError('Limit cannot exceed 100');
    }

    const history = await securityRepository.getLoginHistory(accountId, limit);

    // Format history for frontend
    return history.map((entry) => ({
      id: entry.id,
      action: entry.action_type,
      timestamp: entry.timestamp,
      ip_address: entry.ip_address,
      user_agent: entry.user_agent,

      details: entry.details,
    }));
  }

  /**
   * Enable 2FA for user (placeholder - full implementation requires OTP library)
   * @param {number} accountId - Account ID
   * @returns {Promise<Object>} 2FA setup data
   */
  async enable2FA(/* accountId */) {
    // TODO: Implement 2FA with OTP library (speakeasy, otplib)
    // 1. Generate secret
    // 2. Generate QR code
    // 3. Store secret in account table (add column)
    // 4. Return secret and QR code

    throw new Error('2FA feature not yet implemented - requires OTP library');
  }

  /**
   * Disable 2FA for user
   * @param {number} accountId - Account ID
   * @returns {Promise<Object>} Success message
   */
  async disable2FA(/* accountId */) {
    // TODO: Implement 2FA disable
    // 1. Verify current password or OTP
    // 2. Remove 2FA secret from account
    // 3. Mark 2FA as disabled

    throw new Error('2FA feature not yet implemented - requires OTP library');
  }

  /**
   * Verify 2FA token
   * @param {number} accountId - Account ID
   * @param {string} token - OTP token
   * @returns {Promise<boolean>} Verification result
   */
  async verify2FA(/* accountId, token */) {
    // TODO: Implement 2FA verification
    // 1. Get 2FA secret from account
    // 2. Verify token against secret
    // 3. Return true/false

    throw new Error('2FA feature not yet implemented - requires OTP library');
  }
}

module.exports = new SecurityService();
