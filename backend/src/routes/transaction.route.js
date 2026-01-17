/**
 * Transaction Routes
 */

const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transaction.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/transactions
 * @desc    Get all transactions
 * @access  Private
 */
router.get('/', transactionController.getAll);

/**
 * @route   GET /api/v1/transactions/:id
 * @desc    Get transaction by ID
 * @access  Private
 */
router.get('/:id', transactionController.getById);

/**
 * @route   POST /api/v1/transactions
 * @desc    Create new transaction
 * @access  Private
 */
router.post('/', transactionController.create);

/**
 * @route   PUT /api/v1/transactions/:id
 * @desc    Update transaction
 * @access  Private
 */
router.put('/:id', transactionController.update);

/**
 * @route   PUT /api/v1/transactions/:id/finalize
 * @desc    Finalize transaction
 * @access  Private
 */
router.put('/:id/finalize', transactionController.finalize);

/**
 * @route   PUT /api/v1/transactions/:id/cancel
 * @desc    Cancel transaction
 * @access  Private
 */
router.put('/:id/cancel', transactionController.cancel);

module.exports = router;
