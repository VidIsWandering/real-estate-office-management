/**
 * Jest Setup File
 * Runs before each test suite
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-12345';
process.env.JWT_EXPIRES_IN = '7d';
process.env.JWT_REFRESH_EXPIRES_IN = '30d';
process.env.PORT = '3001'; // Different port for tests

// Set test database config
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5433';
process.env.DB_USER = 'devuser';
process.env.DB_PASSWORD = 'devpassword';
process.env.DB_NAME = 'se100_test_db';
process.env.DB_SSL = 'false';

// Increase timeout for database operations
jest.setTimeout(10000);

// Global test utilities
global.testUtils = {
  // Helper to wait for async operations
  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

// Suppress console logs during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };
