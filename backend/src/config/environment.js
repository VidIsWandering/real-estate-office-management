/**
 * Environment Configuration
 * Load và validate các biến môi trường từ .env
 */

require('dotenv').config();

const config = {
  // Server
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  api_prefix: process.env.API_PREFIX || '/api/v1',

  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'real_estate_db',
    min: parseInt(process.env.DB_POOL_MIN, 10) || 2,
    max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d',
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },

  // Upload
  upload: {
    max_size: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880, // 5MB
    path: process.env.UPLOAD_PATH || './uploads',
  },

  // Logging
  log_level: process.env.LOG_LEVEL || 'info',
};

// Validate required fields
const requiredEnvVars = [
  'DB_PASSWORD',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
    'Please check your .env file'
  );
}

module.exports = config;