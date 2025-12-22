/**
 * Main Routes - Tập hợp tất cả routes
 */

const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth.route');
const staffRoutes = require('./staff.route');
const clientRoutes = require('./client.route');
const realEstateRoutes = require('./real-estate.route');
const appointmentRoutes = require('./appointment.route');
const transactionRoutes = require('./transaction.route');
const contractRoutes = require('./contract.route');
const voucherRoutes = require('./voucher.route');
const reportRoutes = require('./report.route');
const systemRoutes = require('./system.route');

/**
 * Route mapping
 */
router.use('/auth', authRoutes);
router.use('/staff', staffRoutes);
router.use('/clients', clientRoutes);
router.use('/real-estates', realEstateRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/transactions', transactionRoutes);
router.use('/contracts', contractRoutes);
router.use('/vouchers', voucherRoutes);
router.use('/reports', reportRoutes);

// System routes (logs, config, terms, debts)
router.use('/', systemRoutes);

module.exports = router;
