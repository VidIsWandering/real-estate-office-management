/**
 * Express Application Setup
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const config = require('./config/environment');
const logger = require('./utils/logger.util');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

// Import routes
const routes = require('./routes/index.route');

const app = express();

// ============================================================================
// MIDDLEWARES
// ============================================================================

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: config.node_env === 'production' 
    ? ['https://yourdomain.com'] // Thay bằng domain thật
    : '*',
  credentials: true,
}));

// Compression
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
if (config.node_env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use(config.api_prefix, routes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;