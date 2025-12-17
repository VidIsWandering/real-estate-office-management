require('dotenv').config({ path: __dirname + '/../.env' });

console.log('===== ENVIRONMENT VARIABLES =====');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
process.env.


console.log('================================');

// const config = require('./config/environment');
// console.log('\n===== LOADED CONFIG =====');
// console.log('config.db:', config.db);