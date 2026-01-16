// src/controllers/report.controller.js

const reportService = require('../services/report.service');
const { ApiError } = require('../utils/apiError');

class ReportController {
  /**
   * GET /api/v1/reports/revenue
   * Lấy báo cáo doanh thu
   */
  async getRevenueReport(req, res, next) {
    try {
      const filters = {
        fromDate: req.query.fromDate || null,
        toDate: req.query.toDate || null,
        staffId: req.query.staffId ? parseInt(req.query.staffId) : null,
        location: req.query.location || null,
        status: req.query.status || null,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      };

      const data = await reportService.getRevenueReport(filters);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports/agent-performance
   * Lấy báo cáo hiệu suất agent
   */
  async getAgentPerformanceReport(req, res, next) {
    try {
      const filters = {
        fromDate: req.query.fromDate || null,
        toDate: req.query.toDate || null,
        staffId: req.query.staffId ? parseInt(req.query.staffId) : null,
      };

      const data = await reportService.getAgentPerformanceReport(filters);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports/debt
   * Lấy báo cáo công nợ
   */
  async getDebtReport(req, res, next) {
    try {
      const filters = {
        signedOnly: req.query.signedOnly !== 'false',
        customerName: req.query.customerName || null,
        contractId: req.query.contractId
          ? parseInt(req.query.contractId)
          : null,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      };

      const data = await reportService.getDebtReport(filters);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports/dashboard/stats
   * Lấy thống kê dashboard
   */
  async getDashboardStats(req, res, next) {
    try {
      const data = await reportService.getDashboardStats();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports/dashboard/recent-transactions
   * Lấy giao dịch gần đây
   */
  async getRecentTransactions(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const data = await reportService.getRecentTransactions(limit);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports/dashboard/top-properties
   * Lấy top BĐS giá trị cao
   */
  async getTopProperties(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const status = req.query.status || null;
      const data = await reportService.getTopProperties(limit, status);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports/dashboard/agent-performance-chart
   * Lấy dữ liệu biểu đồ agent
   */
  async getAgentPerformanceChart(req, res, next) {
    try {
      const data = await reportService.getAgentPerformanceChart();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports/dashboard/property-sales-chart
   * Lấy dữ liệu biểu đồ BĐS
   */
  async getPropertySalesChart(req, res, next) {
    try {
      const data = await reportService.getPropertySalesChart();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports/revenue/export
   * Export báo cáo doanh thu
   */
  async exportRevenueReport(req, res, next) {
    try {
      const format = req.query.format;
      const filters = {
        fromDate: req.query.fromDate || null,
        toDate: req.query.toDate || null,
        staffId: req.query.staffId ? parseInt(req.query.staffId) : null,
        location: req.query.location || null,
        status: req.query.status || null,
      };

      if (format === 'xlsx') {
        const workbook = await reportService.exportRevenueToExcel(filters);
        const filename = `revenue-report-${new Date().toISOString().split('T')[0]}.xlsx`;

        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}"`
        );

        await workbook.xlsx.write(res);
        res.end();
      } else if (format === 'pdf') {
        // PDF export - simplified version
        throw new ApiError(501, 'PDF export chưa được hỗ trợ');
      } else {
        throw new ApiError(400, 'Format không hợp lệ');
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports/agent-performance/export
   * Export báo cáo hiệu suất agent
   */
  async exportAgentPerformanceReport(req, res, next) {
    try {
      const format = req.query.format;
      const filters = {
        fromDate: req.query.fromDate || null,
        toDate: req.query.toDate || null,
        staffId: req.query.staffId ? parseInt(req.query.staffId) : null,
      };

      if (format === 'xlsx') {
        const workbook =
          await reportService.exportAgentPerformanceToExcel(filters);
        const filename = `agent-performance-${new Date().toISOString().split('T')[0]}.xlsx`;

        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}"`
        );

        await workbook.xlsx.write(res);
        res.end();
      } else if (format === 'pdf') {
        throw new ApiError(501, 'PDF export chưa được hỗ trợ');
      } else {
        throw new ApiError(400, 'Format không hợp lệ');
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/reports/debt/export
   * Export báo cáo công nợ
   */
  async exportDebtReport(req, res, next) {
    try {
      const format = req.query.format;
      const filters = {
        signedOnly: req.query.signedOnly !== 'false',
        customerName: req.query.customerName || null,
        contractId: req.query.contractId
          ? parseInt(req.query.contractId)
          : null,
      };

      if (format === 'xlsx') {
        const workbook = await reportService.exportDebtToExcel(filters);
        const filename = `debt-report-${new Date().toISOString().split('T')[0]}.xlsx`;

        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}"`
        );

        await workbook.xlsx.write(res);
        res.end();
      } else if (format === 'pdf') {
        throw new ApiError(501, 'PDF export chưa được hỗ trợ');
      } else {
        throw new ApiError(400, 'Format không hợp lệ');
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
