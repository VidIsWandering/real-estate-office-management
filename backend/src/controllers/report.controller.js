/**
 * Report Controller - Báo cáo & Thống kê
 */

const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../middlewares/error.middleware');

class ReportController {
  /**
   * GET /reports/revenue
   * Báo cáo doanh thu
   */
  async getRevenue(req, res) {
    // TODO: Implement với reportService.getRevenue(req.query)

    return successResponse(
      res,
      {
        summary: {
          total_revenue: 0,
          total_transactions: 0,
          total_contracts: 0,
        },
        by_period: [],
        by_agent: [],
      },
      'Revenue report retrieved successfully'
    );
  }

  /**
   * GET /reports/performance
   * Báo cáo hiệu suất Agent
   */
  async getPerformance(req, res) {
    // TODO: Implement

    return successResponse(
      res,
      [],
      'Performance report retrieved successfully'
    );
  }

  /**
   * GET /reports/real-estate-status
   * Báo cáo tình trạng BĐS
   */
  async getRealEstateStatus(req, res) {
    // TODO: Implement

    return successResponse(
      res,
      {
        total: 0,
        by_status: {
          created: 0,
          pending: 0,
          listed: 0,
          negotiating: 0,
          transacted: 0,
          suspended: 0,
        },
        by_type: [],
        by_transaction_type: {
          sale: 0,
          rent: 0,
        },
      },
      'Real estate status report retrieved successfully'
    );
  }

  /**
   * GET /reports/financial
   * Báo cáo tài chính
   */
  async getFinancial(req, res) {
    // TODO: Implement

    return successResponse(
      res,
      {
        summary: {
          total_receipts: 0,
          total_payments: 0,
          net_income: 0,
          total_outstanding: 0,
        },
        by_period: [],
        by_payment_method: {
          cash: 0,
          bank_transfer: 0,
        },
      },
      'Financial report retrieved successfully'
    );
  }
}

const controller = new ReportController();

module.exports = {
  getRevenue: asyncHandler((req, res) => controller.getRevenue(req, res)),
  getPerformance: asyncHandler((req, res) =>
    controller.getPerformance(req, res)
  ),
  getRealEstateStatus: asyncHandler((req, res) =>
    controller.getRealEstateStatus(req, res)
  ),
  getFinancial: asyncHandler((req, res) => controller.getFinancial(req, res)),
};
