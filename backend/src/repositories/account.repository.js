/**
 * Account Repository - Tương tác với database
 */

const { db } = require('../config/database');
const Account = require('../models/account.model');

class AccountRepository {
  /**
   * Tạo account mới
   */
  // async create(username, hashedPassword) {
  //   const sql = `
  //     INSERT INTO account (username, password)
  //     VALUES ($1, $2)
  //     RETURNING *
  //   `;
  //   const result = await db.query(sql, [username, hashedPassword]);
  //   return new Account(result.rows[0]);
  // }

  async create(username, hashedPassword) {
    console.log('Creating account:');
    console.log('- Username length:', username.length, 'value:', username);
    console.log('- Password length:', hashedPassword.length);

    const sql = `
    INSERT INTO account (username, password)
    VALUES ($1, $2)
    RETURNING *
  `;
    const result = await db.query(sql, [username, hashedPassword]);
    return new Account(result.rows[0]);
  }

  /**
   * Tìm account theo username
   */
  async findByUsername(username) {
    const sql = `
      SELECT * FROM account
      WHERE username = $1
    `;
    const result = await db.query(sql, [username]);
    if (result.rows.length === 0) return null;
    return new Account(result.rows[0]);
  }

  /**
   * Tìm account theo id
   */
  async findById(id) {
    const sql = `
      SELECT * FROM account
      WHERE id = $1
    `;
    const result = await db.query(sql, [id]);
    if (result.rows.length === 0) return null;
    return new Account(result.rows[0]);
  }

  /**
   * Check username đã tồn tại chưa
   */
  async existsByUsername(username) {
    const sql = `
      SELECT EXISTS(SELECT 1 FROM account WHERE username = $1) as exists
    `;
    const result = await db.query(sql, [username]);
    return result.rows[0].exists;
  }

  /**
   * Update password
   */
  async updatePassword(id, hashedPassword) {
    const sql = `
      UPDATE account
      SET password = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(sql, [hashedPassword, id]);
    if (result.rows.length === 0) return null;
    return new Account(result.rows[0]);
  }

  /**
   * Delete account
   */
  async delete(id) {
    const sql = `
      DELETE FROM account
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(sql, [id]);
    return result.rowCount > 0;
  }
}

module.exports = new AccountRepository();
