// test-jwt.js
require('dotenv').config({ path: __dirname + '/../.env' });

console.log('===== ALL ENVIRONMENT VARIABLES =====');
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('JWT_REFRESH_EXPIRE:', process.env.JWT_REFRESH_EXPIRE);

console.log('\n===== CHECK IF UNDEFINED =====');
console.log('JWT_SECRET === undefined?', process.env.JWT_SECRET === undefined);
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);

console.log('\n===== ALL KEYS STARTING WITH JWT =====');
Object.keys(process.env)
  .filter(key => key.startsWith('JWT'))
  .forEach(key => console.log(`${key}: ${process.env[key]}`));