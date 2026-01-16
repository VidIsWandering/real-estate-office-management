// src/services/report.service.js

const reportRepository = require('../repositories/report.repository');
const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');

class ReportService {
  /**
   * Lấy báo cáo doanh thu
   */
  async getRevenueReport(filters) {
    const { items, total, summary } =
      await reportRepository.getRevenueReport(filters);

    // Transform items
    const transformedItems = items.map((item) => ({
      id: item.id,
      contractNo: item.contract_no,
      property: {
        id: item.property_id,
        title: item.property_title,
        location: item.property_location,
      },
      agent: {
        id: item.agent_id,
        fullName: item.agent_name,
      },
      totalValue: parseFloat(item.total_value),
      signedDate: item.signed_date,
      transactionType: item.transaction_type,
      status: item.status,
    }));

    // Calculate summary
    const totalRevenue = summary.reduce(
      (sum, s) => sum + parseFloat(s.status_value || 0),
      0
    );
    const totalContracts = summary.reduce(
      (sum, s) => sum + parseInt(s.status_count || 0),
      0
    );

    const byStatus = summary.reduce((acc, s) => {
      acc[s.status] = {
        count: parseInt(s.status_count),
        value: parseFloat(s.status_value),
      };
      return acc;
    }, {});

    return {
      items: transformedItems,
      summary: {
        totalRevenue,
        totalContracts,
        byStatus,
      },
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        totalItems: total,
        totalPages: Math.ceil(total / (filters.limit || 20)),
      },
    };
  }

  /**
   * Lấy báo cáo hiệu suất agent
   */
  async getAgentPerformanceReport(filters) {
    const items = await reportRepository.getAgentPerformanceReport(filters);

    const transformedItems = items.map((item) => ({
      id: item.id,
      agentName: item.full_name,
      email: item.email,
      properties: parseInt(item.properties),
      completedAppointments: parseInt(item.completed_appointments),
      initiatedDeals: parseInt(item.initiated_deals),
      successfulContracts: parseInt(item.successful_contracts),
      conversionRate: parseFloat(item.conversion_rate),
      revenue: parseFloat(item.revenue),
    }));

    const totalRevenue = transformedItems.reduce(
      (sum, item) => sum + item.revenue,
      0
    );
    const avgConversionRate =
      transformedItems.length > 0
        ? transformedItems.reduce((sum, item) => sum + item.conversionRate, 0) /
          transformedItems.length
        : 0;

    return {
      items: transformedItems,
      summary: {
        totalAgents: transformedItems.length,
        totalRevenue,
        avgConversionRate: parseFloat(avgConversionRate.toFixed(2)),
      },
    };
  }

  /**
   * Lấy báo cáo công nợ
   */
  async getDebtReport(filters) {
    const { items, total, summary } =
      await reportRepository.getDebtReport(filters);

    const transformedItems = items.map((item) => ({
      id: item.id,
      contractNo: item.contract_no,
      customer: {
        id: item.customer_id,
        fullName: item.customer_name,
        phone: item.customer_phone,
        email: item.customer_email,
      },
      totalValue: parseFloat(item.total_value),
      paidAmount: parseFloat(item.paid_amount),
      remainingAmount: parseFloat(item.remaining_amount),
      dueDate: item.due_date,
      status: item.status,
      isOverdue: item.is_overdue,
    }));

    return {
      items: transformedItems,
      summary: {
        totalReceivables: parseFloat(summary.total_receivables),
        totalContracts: parseInt(summary.total_contracts),
        overdueAmount: parseFloat(summary.overdue_amount),
        overdueContracts: parseInt(summary.overdue_contracts),
      },
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        totalItems: total,
        totalPages: Math.ceil(total / (filters.limit || 20)),
      },
    };
  }

  /**
   * Lấy thống kê dashboard
   */
  async getDashboardStats() {
    return await reportRepository.getDashboardStats();
  }

  /**
   * Lấy giao dịch gần đây
   */
  async getRecentTransactions(limit) {
    const items = await reportRepository.getRecentTransactions(limit);

    return items.map((item) => ({
      id: item.id,
      property: {
        id: item.property_id,
        title: item.property_title,
      },
      agent: {
        id: item.agent_id,
        fullName: item.agent_name,
      },
      amount: parseFloat(item.amount),
      date: item.date,
      type: item.transaction_type,
    }));
  }

  /**
   * Lấy top BĐS
   */
  async getTopProperties(limit, status) {
    const items = await reportRepository.getTopProperties(limit, status);

    return items.map((item) => ({
      id: item.id,
      rank: parseInt(item.rank),
      title: item.title,
      location: item.location,
      price: parseFloat(item.price),
      type: item.type,
      status: item.status,
    }));
  }

  /**
   * Lấy dữ liệu biểu đồ agent
   */
  async getAgentPerformanceChart() {
    const items = await reportRepository.getAgentPerformanceChart();

    return items.map((item) => ({
      agentId: item.agent_id,
      agentName: item.agent_name,
      sales: parseInt(item.sales),
      revenue: parseFloat(item.revenue),
    }));
  }

  /**
   * Lấy dữ liệu biểu đồ BĐS
   */
  async getPropertySalesChart() {
    const items = await reportRepository.getPropertySalesChart();

    return items.map((item) => ({
      type: item.type,
      sold: parseInt(item.sold),
      available: parseInt(item.available),
    }));
  }

  /**
   * Export báo cáo doanh thu ra Excel
   */
  async exportRevenueToExcel(filters) {
    const data = await this.getRevenueReport({
      ...filters,
      page: 1,
      limit: 10000,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Revenue Report');

    // Header styling
    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 8 },
      { header: 'Số hợp đồng', key: 'contractNo', width: 18 },
      { header: 'Bất động sản', key: 'property', width: 35 },
      { header: 'Nhân viên', key: 'agent', width: 20 },
      { header: 'Giá trị (triệu)', key: 'totalValue', width: 18 },
      { header: 'Ngày ký', key: 'signedDate', width: 15 },
      { header: 'Trạng thái', key: 'status', width: 15 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add data rows
    data.items.forEach((item, index) => {
      worksheet.addRow({
        stt: index + 1,
        contractNo: item.contractNo,
        property: item.property.title,
        agent: item.agent.fullName,
        totalValue: item.totalValue,
        signedDate: item.signedDate
          ? new Date(item.signedDate).toLocaleDateString('vi-VN')
          : '',
        status: this._getStatusLabel(item.status),
      });
    });

    // Add summary row
    worksheet.addRow({});
    worksheet.addRow({
      stt: '',
      contractNo: 'TỔNG CỘNG',
      property: '',
      agent: '',
      totalValue: data.summary.totalRevenue,
      signedDate: '',
      status: `${data.summary.totalContracts} hợp đồng`,
    });

    // Format number column
    worksheet.getColumn('totalValue').numFmt = '#,##0';

    return workbook;
  }

  /**
   * Export báo cáo hiệu suất agent ra Excel
   */
  async exportAgentPerformanceToExcel(filters) {
    const data = await this.getAgentPerformanceReport(filters);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Agent Performance');

    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 8 },
      { header: 'Nhân viên', key: 'agentName', width: 25 },
      { header: 'Số BĐS', key: 'properties', width: 12 },
      { header: 'Lịch hẹn HT', key: 'completedAppointments', width: 15 },
      { header: 'GD khởi tạo', key: 'initiatedDeals', width: 15 },
      { header: 'HĐ thành công', key: 'successfulContracts', width: 15 },
      { header: 'Tỷ lệ chuyển đổi', key: 'conversionRate', width: 18 },
      { header: 'Doanh thu (triệu)', key: 'revenue', width: 18 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    data.items.forEach((item, index) => {
      worksheet.addRow({
        stt: index + 1,
        agentName: item.agentName,
        properties: item.properties,
        completedAppointments: item.completedAppointments,
        initiatedDeals: item.initiatedDeals,
        successfulContracts: item.successfulContracts,
        conversionRate: `${item.conversionRate}%`,
        revenue: item.revenue,
      });
    });

    // Summary
    worksheet.addRow({});
    worksheet.addRow({
      stt: '',
      agentName: 'TỔNG CỘNG',
      properties: '',
      completedAppointments: '',
      initiatedDeals: '',
      successfulContracts: '',
      conversionRate: `TB: ${data.summary.avgConversionRate}%`,
      revenue: data.summary.totalRevenue,
    });

    worksheet.getColumn('revenue').numFmt = '#,##0';

    return workbook;
  }

  /**
   * Export báo cáo công nợ ra Excel
   */
  async exportDebtToExcel(filters) {
    const data = await this.getDebtReport({
      ...filters,
      page: 1,
      limit: 10000,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Debt Report');

    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 8 },
      { header: 'Số hợp đồng', key: 'contractNo', width: 18 },
      { header: 'Khách hàng', key: 'customer', width: 25 },
      { header: 'Giá trị HĐ (triệu)', key: 'totalValue', width: 18 },
      { header: 'Đã thanh toán', key: 'paidAmount', width: 18 },
      { header: 'Còn lại', key: 'remainingAmount', width: 18 },
      { header: 'Hạn thanh toán', key: 'dueDate', width: 15 },
      { header: 'Quá hạn', key: 'isOverdue', width: 12 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    data.items.forEach((item, index) => {
      const row = worksheet.addRow({
        stt: index + 1,
        contractNo: item.contractNo,
        customer: item.customer.fullName,
        totalValue: item.totalValue,
        paidAmount: item.paidAmount,
        remainingAmount: item.remainingAmount,
        dueDate: item.dueDate
          ? new Date(item.dueDate).toLocaleDateString('vi-VN')
          : '',
        isOverdue: item.isOverdue ? 'Có' : 'Không',
      });

      // Highlight overdue rows
      if (item.isOverdue) {
        row.getCell('remainingAmount').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC7CE' },
        };
      }
    });

    // Summary
    worksheet.addRow({});
    worksheet.addRow({
      stt: '',
      contractNo: 'TỔNG CÔNG NỢ',
      customer: '',
      totalValue: '',
      paidAmount: '',
      remainingAmount: data.summary.totalReceivables,
      dueDate: '',
      isOverdue: `${data.summary.overdueContracts} quá hạn`,
    });

    ['totalValue', 'paidAmount', 'remainingAmount'].forEach((col) => {
      worksheet.getColumn(col).numFmt = '#,##0';
    });

    return workbook;
  }

  /**
   * Helper: Get status label
   */
  _getStatusLabel(status) {
    const labels = {
      draft: 'Nháp',
      pending_signature: 'Chờ ký',
      signed: 'Đã ký',
      notarized: 'Đã công chứng',
      finalized: 'Hoàn tất',
      cancelled: 'Đã hủy',
    };
    return labels[status] || status;
  }
}

module.exports = new ReportService();
