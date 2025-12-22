/**
 * Express Application Setup
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const config = require('./config/environment');
const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger.util');
const {
  notFoundHandler,
  errorHandler,
} = require('./middlewares/error.middleware');

// Import routes
const routes = require('./routes/index.route');

const app = express();

// ============================================================================
// MIDDLEWARES
// ============================================================================

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.node_env === 'production' ? config.cors.origins : '*',
    credentials: true,
  })
);

// Compression
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
if (config.node_env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
}

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// ============================================================================
// API DOCUMENTATION (Swagger UI)
// ============================================================================

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Real Estate API Docs',
  swaggerOptions: {
    persistAuthorization: true,
  },
};

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

// Serve OpenAPI spec as JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ============================================================================
// ROUTES
// ============================================================================

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Real Estate Management System API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/health',
    api: config.api_prefix,
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.node_env,
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
