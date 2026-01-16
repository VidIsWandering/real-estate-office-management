/**
 * Constants - Các hằng số và ENUM values từ database
 */

const STAFF_ROLES = {
  MANAGER: 'manager',
  LEGAL_OFFICER: 'legal_officer',
  AGENT: 'agent',
  ACCOUNTANT: 'accountant',
};

const STAFF_STATUS = {
  WORKING: 'working',
  OFF_DUTY: 'off_duty',
};

const CLIENT_TYPES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  LANDLORD: 'landlord',
  TENANT: 'tenant',
};

const TRANSACTION_TYPES = {
  SALE: 'sale',
  RENT: 'rent',
};

const DIRECTIONS = {
  NORTH: 'north',
  SOUTH: 'south',
  EAST: 'east',
  WEST: 'west',
  NORTHEAST: 'northeast',
  NORTHWEST: 'northwest',
  SOUTHEAST: 'southeast',
  SOUTHWEST: 'southwest',
};

const REAL_ESTATE_STATUS = {
  CREATED: 'created',
  PENDING_LEGAL_CHECK: 'pending_legal_check',
  LISTED: 'listed',
  NEGOTIATING: 'negotiating',
  TRANSACTED: 'transacted',
  SUSPENDED: 'suspended',
};

const APPOINTMENT_STATUS = {
  CREATED: 'created',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const TRANSACTION_STATUS = {
  NEGOTIATING: 'negotiating',
  PENDING_CONTRACT: 'pending_contract',
  CANCELLED: 'cancelled',
};

const CONTRACT_TYPES = {
  DEPOSIT: 'deposit',
  PURCHASE: 'purchase',
  LEASE: 'lease',
};

const CONTRACT_STATUS = {
  DRAFT: 'draft',
  PENDING_SIGNATURE: 'pending_signature',
  SIGNED: 'signed',
  NOTARIZED: 'notarized',
  FINALIZED: 'finalized',
  CANCELLED: 'cancelled',
};

const VOUCHER_TYPES = {
  RECEIPT: 'receipt',
  PAYMENT: 'payment',
};

const PAYMENT_METHODS = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
};

const VOUCHER_STATUS = {
  CREATED: 'created',
  CONFIRMED: 'confirmed',
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

module.exports = {
  STAFF_ROLES,
  STAFF_STATUS,
  CLIENT_TYPES,
  TRANSACTION_TYPES,
  DIRECTIONS,
  REAL_ESTATE_STATUS,
  APPOINTMENT_STATUS,
  TRANSACTION_STATUS,
  CONTRACT_TYPES,
  CONTRACT_STATUS,
  VOUCHER_TYPES,
  PAYMENT_METHODS,
  VOUCHER_STATUS,
  HTTP_STATUS,
  PAGINATION,
};
