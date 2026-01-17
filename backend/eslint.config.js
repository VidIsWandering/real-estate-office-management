// backend/eslint.config.js
const globals = require('globals');
const js = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // 1. Cấu hình ESLint cơ bản (eslint:recommended)
  js.configs.recommended,

  // 2. Cấu hình Prettier (TẮT các rules xung đột với format)
  // Phải đặt sau `js.configs.recommended`
  prettierConfig,

  // 3. Cấu hình tùy chỉnh cho dự án Node.js
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.es6,
      },
    },
    rules: {},
  },

  // 4. Bật jest globals cho file test
  {
    files: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
