/**
 * JWT Utility - Generate và verify JWT tokens
 */

const jwt = require('jsonwebtoken');
const config = require('../config/environment');

/**
 * Generate access token
 * @param {object} payload - Data để mã hóa vào token
 * @returns {string} JWT token
 */
const generateAccessToken = (payload) => {
  try {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expire,
    });
  } catch (error) {
    throw new Error('Error generating access token');
  }
};

/**
 * Generate refresh token
 * @param {object} payload - Data để mã hóa vào token
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, config.jwt.refresh_secret, {
      expiresIn: config.jwt.refresh_expire,
    });
  } catch (error) {
    throw new Error('Error generating refresh token');
  }
};

/**
 * Verify access token
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {object} Decoded payload
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refresh_secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    }
    throw new Error('Refresh token verification failed');
  }
};

/**
 * Decode token without verification (để debug)
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};