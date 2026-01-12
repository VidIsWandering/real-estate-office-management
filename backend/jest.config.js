/**
 * Jest Configuration
 * @type {import('jest').Config}
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test match patterns
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js', // Entry point
    '!src/**/*.test.js',
    '!src/__tests__/**',
    '!src/config/**', // Config files
    '!src/docs/**', // Swagger docs
  ],

  coverageDirectory: 'coverage',

  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 70,
      statements: 70,
    },
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],

  // Clear mocks automatically between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Test timeout (10 seconds for integration tests)
  testTimeout: 10000,

  // Module paths
  moduleDirectories: ['node_modules', 'src'],

  // Transform ignore patterns
  transformIgnorePatterns: ['node_modules/(?!(supertest)/)'],

  // Run tests serially to avoid database deadlocks
  maxWorkers: 1,
};
