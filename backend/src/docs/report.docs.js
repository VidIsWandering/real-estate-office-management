/**
 * @swagger
 * /reports/revenue:
 *   get:
 *     summary: Revenue report
 *     description: |
 *       Báo cáo doanh thu (UC8.1).
 *       - Có thể filter theo thời gian, agent
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: from_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: staff_id
 *         schema:
 *           type: integer
 *         description: Lọc theo Agent
 *       - in: query
 *         name: group_by
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter]
 *           default: month
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total_revenue:
 *                           type: number
 *                           example: 15000000000
 *                         total_transactions:
 *                           type: integer
 *                           example: 25
 *                         total_contracts:
 *                           type: integer
 *                           example: 20
 *                     by_period:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           period:
 *                             type: string
 *                             example: '2024-01'
 *                           revenue:
 *                             type: number
 *                           transactions_count:
 *                             type: integer
 *                     by_agent:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           staff_id:
 *                             type: integer
 *                           staff_name:
 *                             type: string
 *                           revenue:
 *                             type: number
 *                           transactions_count:
 *                             type: integer
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 * /reports/performance:
 *   get:
 *     summary: Agent performance report
 *     description: |
 *       Báo cáo hiệu suất Agent (UC8.2).
 *       - Thống kê số deals, lịch hẹn, khách hàng...
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: from_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: staff_id
 *         schema:
 *           type: integer
 *         description: Xem chi tiết một Agent cụ thể
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       staff:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           full_name:
 *                             type: string
 *                       metrics:
 *                         type: object
 *                         properties:
 *                           appointments_count:
 *                             type: integer
 *                             description: Số lịch hẹn
 *                           completed_appointments:
 *                             type: integer
 *                           transactions_count:
 *                             type: integer
 *                             description: Số giao dịch
 *                           successful_transactions:
 *                             type: integer
 *                           conversion_rate:
 *                             type: number
 *                             description: Tỷ lệ chuyển đổi (%)
 *                           total_revenue:
 *                             type: number
 *                           clients_count:
 *                             type: integer
 *                             description: Số khách hàng mới
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 * /reports/real-estate-status:
 *   get:
 *     summary: Real estate status report
 *     description: |
 *       Báo cáo tình trạng BĐS (UC8.3).
 *       - Thống kê số lượng BĐS theo status, loại, khu vực...
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: group_by
 *         schema:
 *           type: string
 *           enum: [status, type, location, transaction_type]
 *           default: status
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
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 150
 *                     by_status:
 *                       type: object
 *                       properties:
 *                         created:
 *                           type: integer
 *                         pending:
 *                           type: integer
 *                         listed:
 *                           type: integer
 *                         negotiating:
 *                           type: integer
 *                         transacted:
 *                           type: integer
 *                         suspended:
 *                           type: integer
 *                     by_type:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     by_transaction_type:
 *                       type: object
 *                       properties:
 *                         sale:
 *                           type: integer
 *                         rent:
 *                           type: integer
 *
 * /reports/financial:
 *   get:
 *     summary: Financial report
 *     description: |
 *       Báo cáo tài chính (UC8.4).
 *       - Thống kê thu/chi, công nợ
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: from_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: group_by
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: month
 *     responses:
 *       200:
 *         description: Financial report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total_receipts:
 *                           type: number
 *                           description: Tổng thu
 *                         total_payments:
 *                           type: number
 *                           description: Tổng chi
 *                         net_income:
 *                           type: number
 *                           description: Thu - Chi
 *                         total_outstanding:
 *                           type: number
 *                           description: Tổng công nợ
 *                     by_period:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           period:
 *                             type: string
 *                           receipts:
 *                             type: number
 *                           payments:
 *                             type: number
 *                           net:
 *                             type: number
 *                     by_payment_method:
 *                       type: object
 *                       properties:
 *                         cash:
 *                           type: number
 *                         bank_transfer:
 *                           type: number
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

module.exports = {};
