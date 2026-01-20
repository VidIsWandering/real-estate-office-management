// src/models/voucher.model.js

/**
 * Voucher Model - Phiếu thu/chi
 *
 * Database table: voucher
 */

const VOUCHER_TYPE = {
  RECEIPT: 'receipt', // Phiếu thu
  PAYMENT: 'payment', // Phiếu chi
};

const VOUCHER_STATUS = {
  CREATED: 'created', // Mới tạo
  CONFIRMED: 'confirmed', // Đã xác nhận
};

const PAYMENT_METHOD = {
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
};

/**
 * Generate voucher number
 * @param {string} type - receipt or payment
 * @param {number} id - voucher ID
 * @param {Date} date - payment date
 * @returns {string} Voucher number (PT-2025-001 or PC-2025-001)
 */
const generateVoucherNo = (type, id, date = new Date()) => {
  const prefix = type === VOUCHER_TYPE.RECEIPT ? 'PT' : 'PC';
  const year = date.getFullYear();
  const paddedId = String(id).padStart(3, '0');
  return `${prefix}-${year}-${paddedId}`;
};

/**
 * Get type label in Vietnamese
 */
const getTypeLabel = (type) => {
  return type === VOUCHER_TYPE.RECEIPT ? 'Phiếu thu' : 'Phiếu chi';
};

/**
 * Get status label in Vietnamese
 */
const getStatusLabel = (status) => {
  const labels = {
    [VOUCHER_STATUS.CREATED]: 'Mới tạo',
    [VOUCHER_STATUS.CONFIRMED]: 'Đã xác nhận',
  };
  return labels[status] || status;
};

/**
 * Get payment method label
 */
const getPaymentMethodLabel = (method) => {
  const labels = {
    [PAYMENT_METHOD.BANK_TRANSFER]: 'Chuyển khoản',
    [PAYMENT_METHOD.CASH]: 'Tiền mặt',
  };
  return labels[method] || method;
};

module.exports = {
  VOUCHER_TYPE,
  VOUCHER_STATUS,
  PAYMENT_METHOD,
  generateVoucherNo,
  getTypeLabel,
  getStatusLabel,
  getPaymentMethodLabel,
};
