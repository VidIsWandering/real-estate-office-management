// src/models/report.model.js

/**
 * Report Model - Định nghĩa các interfaces và types cho Reports
 * Không có table riêng, dữ liệu được aggregate từ các bảng khác
 */

/**
 * @typedef {Object} RevenueReportItem
 * @property {number} id
 * @property {string} contractNo
 * @property {Object} property
 * @property {Object} agent
 * @property {number} totalValue
 * @property {string} signedDate
 * @property {string} status
 */

/**
 * @typedef {Object} AgentPerformanceItem
 * @property {number} id
 * @property {string} agentName
 * @property {string} email
 * @property {number} properties
 * @property {number} completedAppointments
 * @property {number} initiatedDeals
 * @property {number} successfulContracts
 * @property {number} conversionRate
 * @property {number} revenue
 */

/**
 * @typedef {Object} DebtReportItem
 * @property {number} id
 * @property {string} contractNo
 * @property {Object} customer
 * @property {number} totalValue
 * @property {number} paidAmount
 * @property {number} remainingAmount
 * @property {string} dueDate
 * @property {string} status
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalProperties
 * @property {number} activeListings
 * @property {number} totalClients
 * @property {number} totalContracts
 * @property {number} monthlyRevenue
 * @property {number} revenueChange
 */

// Contract status có thể dùng cho báo cáo
const CONTRACT_STATUS = {
  DRAFT: 'draft',
  PENDING_SIGNATURE: 'pending_signature',
  SIGNED: 'signed',
  NOTARIZED: 'notarized',
  FINALIZED: 'finalized',
  CANCELLED: 'cancelled',
};

// Các status được coi là "thành công"
const SUCCESSFUL_CONTRACT_STATUSES = ['signed', 'notarized', 'finalized'];

module.exports = {
  CONTRACT_STATUS,
  SUCCESSFUL_CONTRACT_STATUSES,
};
