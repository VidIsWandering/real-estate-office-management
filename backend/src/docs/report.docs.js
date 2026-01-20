/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     RevenueReportSummary:
 *       type: object
 *       properties:
 *         total_revenue:
 *           type: number
 *           example: 15000000000
 *         total_transactions:
 *           type: integer
 *           example: 25
 *         total_contracts:
 *           type: integer
 *           example: 20
 *
 *     RevenuePeriod:
 *       type: object
 *       properties:
 *         period:
 *           type: string
 *           example: "2024-01"
 *         revenue:
 *           type: number
 *           example: 5000000000
 *         transactions_count:
 *           type: integer
 *           example: 8
 *
 *     RevenueByAgent:
 *       type: object
 *       properties:
 *         staff_id:
 *           type: integer
 *           example: 2
 *         staff_name:
 *           type: string
 *           example: "Trần Thị Agent"
 *         revenue:
 *           type: number
 *           example: 3000000000
 *         transactions_count:
 *           type: integer
 *           example: 5
 *
 *     AgentPerformance:
 *       type: object
 *       properties:
 *         staff:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 2
 *             full_name:
 *               type: string
 *               example: "Trần Thị Agent"
 *         metrics:
 *           type: object
 *           properties:
 *             appointments_count:
 *               type: integer
 *               example: 45
 *             completed_appointments:
 *               type: integer
 *               example: 40
 *             transactions_count:
 *               type: integer
 *               example: 28
 *             successful_transactions:
 *               type: integer
 *               example: 18
 *             conversion_rate:
 *               type: number
 *               example: 64.29
 *             total_revenue:
 *               type: number
 *               example: 8500000000
 *             clients_count:
 *               type: integer
 *               example: 12
 *
 *     DebtRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         contract_no:
 *           type: string
 *           example: "HD001"
 *         contract_type:
 *           type: string
 *         total_value:
 *           type: number
 *         paid_amount:
 *           type: number
 *         remaining_amount:
 *           type: number
 *         customer:
 *           type: string
 *         agent:
 *           type: string
 *         property:
 *           type: string
 *
 * /reports/revenue:
 *   get:
 *     summary: Revenue report
 *     description: |
 *       Báo cáo doanh thu (UC8.1).
 *       - Filter theo thời gian (bắt buộc), agent
 *       - Group by: day, week, month, quarter
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: integer
 *           example: 2
 *         description: Filter by Agent ID
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter]
 *           default: month
 *         description: Group revenue by period
 *     responses:
 *       200:
 *         description: Revenue report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Revenue report retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       $ref: '#/components/schemas/RevenueReportSummary'
 *                     by_period:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RevenuePeriod'
 *                     by_agent:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RevenueByAgent'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /reports/performance:
 *   get:
 *     summary: Agent performance report
 *     description: |
 *       Báo cáo hiệu suất Agent (UC8.2).
 *       - Thống kê số deals, lịch hẹn, khách hàng, conversion rate
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: integer
 *           example: 2
 *         description: Filter by specific Agent ID
 *     responses:
 *       200:
 *         description: Performance report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AgentPerformance'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /reports/real-estate-status:
 *   get:
 *     summary: Real estate status report
 *     description: |
 *       Báo cáo tình trạng BĐS (UC8.3).
 *       - Thống kê số lượng BĐS theo status, loại, khu vực, loại giao dịch
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [status, type, location, transaction_type]
 *           default: status
 *         description: Group properties by
 *     responses:
 *       200:
 *         description: Real estate status report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     by_status:
 *                       type: object
 *                     by_type:
 *                       type: array
 *                       items:
 *                         type: object
 *                     by_transaction_type:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /reports/financial:
 *   get:
 *     summary: Financial report
 *     description: |
 *       Báo cáo tài chính (UC8.4).
 *       - Thống kê thu/chi từ vouchers, công nợ
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: month
 *     responses:
 *       200:
 *         description: Financial report data
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /reports/debt:
 *   get:
 *     summary: Debt report
 *     description: |
 *       Báo cáo công nợ.
 *       - Danh sách hợp đồng còn nợ
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: statusSigned
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Chỉ lấy hợp đồng đã ký
 *       - in: query
 *         name: customer
 *         schema:
 *           type: string
 *         description: Tìm theo tên khách hàng
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Debt report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DebtRecord'
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalDebt:
 *                           type: number
 *                         totalContracts:
 *                           type: integer
 *                     pagination:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /reports/recent-transactions:
 *   get:
 *     summary: Recent transactions
 *     description: Danh sách giao dịch gần đây
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Recent transactions list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /reports/top-properties:
 *   get:
 *     summary: Top properties
 *     description: BĐS có nhiều lượt xem và quan tâm nhất
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Top properties list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

module.exports = {};
