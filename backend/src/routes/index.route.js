/**
 * Main Routes - Tập hợp tất cả routes
 */

const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.route');

/**
 * Route mapping
 */
router.use('/auth', authRoutes);



module.exports = router;