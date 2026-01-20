// src/repositories/report.repository.js

const { db: pool } = require('../config/database');

// const { SUCCESSFUL_CONTRACT_STATUSES } = require('../models/report.model');

class ReportRepository {
  /**
   * Lấy báo cáo doanh thu
   */
  async getRevenueReport({
    fromDate,
    toDate,
    staffId,
    location,
    status,
    page = 1,
    limit = 20,
  }) {
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        c.id,
        CONCAT('HD-', EXTRACT(YEAR FROM c.effective_date), '-', LPAD(c.id::text, 3, '0')) as contract_no,
        re.id as property_id,
        re.title as property_title,
        re.location as property_location,
        re.transaction_type,
        s.id as agent_id,
        s.full_name as agent_name,
        c.total_value,
        c.signed_date,
        c.status
      FROM contract c
      JOIN transaction t ON c.transaction_id = t.id
      JOIN real_estate re ON t.real_estate_id = re.id
      JOIN staff s ON c.staff_id = s.id
      WHERE 
        ($1::date IS NULL OR c.signed_date >= $1)
        AND ($2::date IS NULL OR c.signed_date <= $2)
        AND ($3::bigint IS NULL OR c.staff_id = $3)
        AND ($4::text IS NULL OR re.location ILIKE '%' || $4 || '%')
        AND ($5::text IS NULL OR c.status::text = $5)
      ORDER BY c.signed_date DESC NULLS LAST, c.id DESC
      LIMIT $6 OFFSET $7
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM contract c
      JOIN transaction t ON c.transaction_id = t.id
      JOIN real_estate re ON t.real_estate_id = re.id
      WHERE 
        ($1::date IS NULL OR c.signed_date >= $1)
        AND ($2::date IS NULL OR c.signed_date <= $2)
        AND ($3::bigint IS NULL OR c.staff_id = $3)
        AND ($4::text IS NULL OR re.location ILIKE '%' || $4 || '%')
        AND ($5::text IS NULL OR c.status::text = $5)
    `;

    const summaryQuery = `
      SELECT 
        COALESCE(SUM(c.total_value), 0) as total_revenue,
        COUNT(*) as total_contracts,
        c.status,
        COUNT(*) as status_count,
        COALESCE(SUM(c.total_value), 0) as status_value
      FROM contract c
      JOIN transaction t ON c.transaction_id = t.id
      JOIN real_estate re ON t.real_estate_id = re.id
      WHERE 
        ($1::date IS NULL OR c.signed_date >= $1)
        AND ($2::date IS NULL OR c.signed_date <= $2)
        AND ($3::bigint IS NULL OR c.staff_id = $3)
        AND ($4::text IS NULL OR re.location ILIKE '%' || $4 || '%')
        AND ($5::text IS NULL OR c.status::text = $5)
      GROUP BY c.status
    `;

    const params = [
      fromDate || null,
      toDate || null,
      staffId || null,
      location || null,
      status || null,
    ];

    const [itemsResult, countResult, summaryResult] = await Promise.all([
      pool.query(query, [...params, limit, offset]),
      pool.query(countQuery, params),
      pool.query(summaryQuery, params),
    ]);

    return {
      items: itemsResult.rows,
      total: parseInt(countResult.rows[0].total),
      summary: summaryResult.rows,
    };
  }

  /**
   * Lấy báo cáo hiệu suất agent
   */
  async getAgentPerformanceReport({ fromDate, toDate, staffId }) {
    const query = `
      WITH agent_stats AS (
        SELECT 
          s.id,
          s.full_name,
          s.email,
          
          -- Số BĐS quản lý
          (SELECT COUNT(*) FROM real_estate re WHERE re.staff_id = s.id) as properties,
          
          -- Số lịch hẹn hoàn thành
          (SELECT COUNT(*) FROM appointment a 
           WHERE a.staff_id = s.id 
           AND a.status = 'completed'
           AND ($1::date IS NULL OR a.start_time::date >= $1)
           AND ($2::date IS NULL OR a.start_time::date <= $2)) as completed_appointments,
          
          -- Số giao dịch khởi tạo
          (SELECT COUNT(*) FROM transaction t 
           WHERE t.staff_id = s.id
           AND ($1::date IS NULL OR EXISTS (
             SELECT 1 FROM contract c 
             WHERE c.transaction_id = t.id 
             AND c.effective_date >= $1
           ))) as initiated_deals,
          
          -- Số hợp đồng thành công
          (SELECT COUNT(*) FROM contract c 
           WHERE c.staff_id = s.id 
           AND c.status IN ('signed', 'notarized', 'finalized')
           AND ($1::date IS NULL OR c.effective_date >= $1)
           AND ($2::date IS NULL OR c.effective_date <= $2)) as successful_contracts,
          
          -- Doanh thu
          (SELECT COALESCE(SUM(c.total_value), 0) FROM contract c 
           WHERE c.staff_id = s.id 
           AND c.status IN ('signed', 'notarized', 'finalized')
           AND ($1::date IS NULL OR c.effective_date >= $1)
           AND ($2::date IS NULL OR c.effective_date <= $2)) as revenue
           
        FROM staff s
        WHERE s.position = 'agent'
        AND s.status = 'working'
        AND ($3::bigint IS NULL OR s.id = $3)
      )
      SELECT 
        id,
        full_name,
        email,
        properties,
        completed_appointments,
        initiated_deals,
        successful_contracts,
        revenue,
        CASE 
          WHEN initiated_deals > 0 
          THEN ROUND((successful_contracts::numeric / initiated_deals) * 100, 2)
          ELSE 0 
        END as conversion_rate
      FROM agent_stats
      ORDER BY revenue DESC
    `;

    const result = await pool.query(query, [
      fromDate || null,
      toDate || null,
      staffId || null,
    ]);
    return result.rows;
  }

  /**
   * Lấy báo cáo công nợ
   */
  async getDebtReport({
    signedOnly = true,
    customerName,
    contractId,
    page = 1,
    limit = 20,
  }) {
    const offset = (page - 1) * limit;

    // Xây dựng điều kiện status
    const statusCondition = signedOnly
      ? "AND c.status IN ('signed', 'notarized', 'finalized')"
      : '';

    const query = `
      SELECT 
        c.id,
        CONCAT('HD-', EXTRACT(YEAR FROM c.effective_date), '-', LPAD(c.id::text, 3, '0')) as contract_no,
        cl.id as customer_id,
        cl.full_name as customer_name,
        cl.phone_number as customer_phone,
        cl.email as customer_email,
        c.total_value,
        c.paid_amount,
        c.remaining_amount,
        c.expiration_date as due_date,
        c.status,
        CASE WHEN c.expiration_date < CURRENT_DATE THEN true ELSE false END as is_overdue
      FROM contract c
      JOIN client cl ON c.party_b = cl.id
      WHERE 
        c.remaining_amount > 0
        ${statusCondition}
        AND ($1::text IS NULL OR cl.full_name ILIKE '%' || $1 || '%')
        AND ($2::bigint IS NULL OR c.id = $2)
      ORDER BY c.remaining_amount DESC
      LIMIT $3 OFFSET $4
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM contract c
      JOIN client cl ON c.party_b = cl.id
      WHERE 
        c.remaining_amount > 0
        ${statusCondition}
        AND ($1::text IS NULL OR cl.full_name ILIKE '%' || $1 || '%')
        AND ($2::bigint IS NULL OR c.id = $2)
    `;

    const summaryQuery = `
      SELECT 
        COALESCE(SUM(c.remaining_amount), 0) as total_receivables,
        COUNT(*) as total_contracts,
        COALESCE(SUM(CASE WHEN c.expiration_date < CURRENT_DATE THEN c.remaining_amount ELSE 0 END), 0) as overdue_amount,
        COUNT(CASE WHEN c.expiration_date < CURRENT_DATE THEN 1 END) as overdue_contracts
      FROM contract c
      JOIN client cl ON c.party_b = cl.id
      WHERE 
        c.remaining_amount > 0
        ${statusCondition}
        AND ($1::text IS NULL OR cl.full_name ILIKE '%' || $1 || '%')
        AND ($2::bigint IS NULL OR c.id = $2)
    `;

    const params = [customerName || null, contractId || null];

    const [itemsResult, countResult, summaryResult] = await Promise.all([
      pool.query(query, [...params, limit, offset]),
      pool.query(countQuery, params),
      pool.query(summaryQuery, params),
    ]);

    return {
      items: itemsResult.rows,
      total: parseInt(countResult.rows[0].total),
      summary: summaryResult.rows[0],
    };
  }

  /**
   * Lấy thống kê dashboard
   */
  async getDashboardStats() {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM real_estate) as total_properties,
        (SELECT COUNT(*) FROM real_estate WHERE status = 'listed') as active_listings,
        (SELECT COUNT(*) FROM client) as total_clients,
        (SELECT COUNT(*) FROM contract) as total_contracts,
        (SELECT COALESCE(SUM(total_value), 0) FROM contract 
         WHERE status IN ('signed', 'notarized', 'finalized')
         AND EXTRACT(MONTH FROM effective_date) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(YEAR FROM effective_date) = EXTRACT(YEAR FROM CURRENT_DATE)) as monthly_revenue,
        (SELECT COALESCE(SUM(total_value), 0) FROM contract 
         WHERE status IN ('signed', 'notarized', 'finalized')
         AND EXTRACT(MONTH FROM effective_date) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
         AND EXTRACT(YEAR FROM effective_date) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')) as last_month_revenue
    `;

    const statusQuery = `
      SELECT status, COUNT(*) as count
      FROM real_estate
      GROUP BY status
    `;

    const typeQuery = `
      SELECT 
        type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER(), 0), 1) as percentage
      FROM real_estate
      GROUP BY type
      ORDER BY count DESC
    `;

    const [statsResult, statusResult, typeResult] = await Promise.all([
      pool.query(query),
      pool.query(statusQuery),
      pool.query(typeQuery),
    ]);

    const stats = statsResult.rows[0];
    const revenueChange =
      stats.last_month_revenue > 0
        ? (
            ((stats.monthly_revenue - stats.last_month_revenue) /
              stats.last_month_revenue) *
            100
          ).toFixed(1)
        : 0;

    return {
      overview: {
        totalProperties: parseInt(stats.total_properties),
        activeListings: parseInt(stats.active_listings),
        totalClients: parseInt(stats.total_clients),
        totalContracts: parseInt(stats.total_contracts),
        monthlyRevenue: parseFloat(stats.monthly_revenue),
        revenueChange: parseFloat(revenueChange),
      },
      propertiesByStatus: statusResult.rows.reduce((acc, row) => {
        acc[row.status] = parseInt(row.count);
        return acc;
      }, {}),
      propertiesByType: typeResult.rows.map((row) => ({
        type: row.type,
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage) || 0,
      })),
    };
  }

  /**
   * Lấy giao dịch gần đây
   */
  async getRecentTransactions(limit = 5) {
    const query = `
      SELECT 
        c.id,
        re.id as property_id,
        re.title as property_title,
        re.transaction_type,
        s.id as agent_id,
        s.full_name as agent_name,
        c.total_value as amount,
        c.signed_date as date
      FROM contract c
      JOIN transaction t ON c.transaction_id = t.id
      JOIN real_estate re ON t.real_estate_id = re.id
      JOIN staff s ON c.staff_id = s.id
      WHERE c.status IN ('signed', 'notarized', 'finalized')
      ORDER BY c.signed_date DESC NULLS LAST
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  /**
   * Lấy top BĐS giá trị cao
   */
  async getTopProperties(limit = 5, status = null) {
    const query = `
      SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY price DESC) as rank,
        title,
        location,
        price,
        type,
        status
      FROM real_estate
      WHERE ($1::text IS NULL OR status::text = $1)
      ORDER BY price DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [status, limit]);
    return result.rows;
  }

  /**
   * Lấy dữ liệu biểu đồ hiệu suất agent
   */
  async getAgentPerformanceChart() {
    const query = `
      SELECT 
        s.id as agent_id,
        s.full_name as agent_name,
        COUNT(c.id) as sales,
        COALESCE(SUM(c.total_value), 0) as revenue
      FROM staff s
      LEFT JOIN contract c ON c.staff_id = s.id 
        AND c.status IN ('signed', 'notarized', 'finalized')
      WHERE s.position = 'agent'
      AND s.status = 'working'
      GROUP BY s.id, s.full_name
      ORDER BY revenue DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Lấy dữ liệu biểu đồ BĐS theo loại
   */
  async getPropertySalesChart() {
    const query = `
      SELECT 
        type,
        COUNT(CASE WHEN status = 'transacted' THEN 1 END) as sold,
        COUNT(CASE WHEN status IN ('listed', 'negotiating') THEN 1 END) as available
      FROM real_estate
      GROUP BY type
      ORDER BY (COUNT(CASE WHEN status = 'transacted' THEN 1 END) + 
                COUNT(CASE WHEN status IN ('listed', 'negotiating') THEN 1 END)) DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = new ReportRepository();
