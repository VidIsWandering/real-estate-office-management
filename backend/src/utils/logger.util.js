/**
 * Logger Utility - Winston logger configuration (Fixed version)
 */

const winston = require('winston');
const config = require('../config/environment');

// ============================================================================
// LOG FORMATS
// ============================================================================

// JSON format cho file log
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Format màu sắc dễ đọc khi dev
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// ============================================================================
// TRANSPORTS CONFIGURATION
// ============================================================================

const transports = [
  // Ghi log lỗi ra file riêng
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
  }),

  // Ghi tất cả log ra file chung
  new winston.transports.File({
    filename: 'logs/combined.log',
    maxsize: 5 * 1024 * 1024,
    maxFiles: 5,
  }),
];

// Chỉ thêm console khi không phải production
if (config.node_env !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// ============================================================================
// CREATE LOGGER
// ============================================================================

const logger = winston.createLogger({
  level: config.log_level || 'info',
  format: logFormat,
  defaultMeta: { service: 'real-estate-api' },
  transports,
});

module.exports = logger;
