// backend/eslint.config.js
const globals = require("globals");
const js = require("@eslint/js");
const prettierConfig = require("eslint-config-prettier");

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
      sourceType: "commonjs", // Vì dự án dùng `require` và `module.exports`
      globals: {
        ...globals.node, // Thêm các biến toàn cục của Node.js
        ...globals.es6    // Thêm các biến toàn cục của ES6
      }
    },
    rules: {
      // Bạn có thể thêm các rule tùy chỉnh ở đây
      // Ví dụ: "no-unused-vars": "warn" // Báo warning thay vì lỗi
    }
  }
];