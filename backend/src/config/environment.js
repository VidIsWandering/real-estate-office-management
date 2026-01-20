/**
 * Environment Configuration
 * Load và validate các biến môi trường từ .env
 */

require('dotenv').config();

/**
 * Parse DATABASE_URL nếu có
 * Format: postgresql://user:password@host:port/database
 */
const parseDatabaseUrl = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port, 10) || 5432,
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.slice(1), // Remove leading '/'
    };
  } catch {
    console.warn(
      'Invalid DATABASE_URL format, falling back to individual vars'
    );
    return null;
  }
};

// Parse DATABASE_URL if provided
const dbFromUrl = parseDatabaseUrl(process.env.DATABASE_URL);

const config = {
  // Server
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 8080,
  api_prefix: process.env.API_PREFIX || '/api/v1',

  // Database (DATABASE_URL takes precedence if valid)
  db: {
    host: dbFromUrl?.host || process.env.DB_HOST || 'localhost',
    port: dbFromUrl?.port || parseInt(process.env.DB_PORT, 10) || 5432,
    user: dbFromUrl?.user || process.env.DB_USER || 'devuser',
    password: dbFromUrl?.password || process.env.DB_PASSWORD || 'devpassword',
    database: dbFromUrl?.database || process.env.DB_NAME || 'real_estate_db',
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

  // Cloudinary
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  // CORS
  cors: {
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
      : [],
  },

  // Logging
  log_level: process.env.LOG_LEVEL || 'info',
};

// Validate required fields (only in non-test environment)
if (process.env.NODE_ENV !== 'test') {
  const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];

  // DB_PASSWORD is required unless DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    requiredEnvVars.push('DB_PASSWORD');
  }

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missingVars.join(', ')}\n` +
        'Please check your .env file (copy from .env.example)'
    );
    process.exit(1);
  }
}

module.exports = config;
