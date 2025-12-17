/**
 * Account Model - Định nghĩa structure của account
 */

class Account {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.created_at = data.created_at;
  }

  /**
   * Convert to JSON (không trả password)
   */
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      created_at: this.created_at,
    };
  }

  /**
   * Convert to JSON (có password - dùng nội bộ)
   */
  toJSONWithPassword() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      created_at: this.created_at,
    };
  }
}

module.exports = Account;
