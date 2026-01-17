/**
 * Database Configuration
 * File này tạo kết nối đến PostgreSQL
 */

const { Pool } = require('pg');
const config = require('./environment');

// Tạo connection pool

// SSL config for cloud/staging (Render, Heroku, etc.)
const sslEnabled =
  process.env.DB_SSL === 'true' ||
  process.env.DATABASE_SSL === 'true' ||
  process.env.NODE_ENV === 'production';
const db = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  min: config.db.min,
  max: config.db.max,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});

/**
 * Test kết nối database
 */
const testConnection = async () => {
  try {
    const result = await db.query('SELECT NOW()');
    console.log(' Database connected:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error(' Database connection failed:', error.message);
    throw error;
  }
};

/**
 * Đóng kết nối database
 */
const closeConnection = async () => {
  try {
    await db.end();
    console.log(' Database connection closed');
  } catch (error) {
    console.error(' Error closing database:', error.message);
  }
};

// Export
module.exports = {
  db,
  testConnection,
  closeConnection,
};
