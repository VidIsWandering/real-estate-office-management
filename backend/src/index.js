/**
 * Server Entry Point
 */

const app = require('./app');
const config = require('./config/environment');
const logger = require('./utils/logger.util');
const { testConnection, closePool } = require('./config/database');

const PORT = config.port;

// ============================================================================
// START SERVER
// ============================================================================

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Start listening
    const server = app.listen(PORT, () => {
      console.log('Process PID:', process.pid);
      logger.info(`
        
        ================================================
         🚀 Server is running!
        ================================================
        Environment: ${config.node_env}
        Port: ${PORT}
        API URL: http://localhost:${PORT}${config.api_prefix}
        API Docs: http://localhost:${PORT}/api-docs
        Health Check: http://localhost:${PORT}/health
        ================================================
      `);
    });

    // ========================================================================
    // GRACEFUL SHUTDOWN
    // ========================================================================

    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await closePool();
          logger.info('Database connections closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
