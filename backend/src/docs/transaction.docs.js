/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: List transactions
 *     description: Lấy danh sách giao dịch
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/TransactionStatus'
 *       - in: query
 *         name: staff_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: client_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: real_estate_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of transactions
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
 *                     $ref: '#/components/schemas/Transaction'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *
 *   post:
 *     summary: Create transaction
 *     description: |
 *       Tạo giao dịch mới (UC5.1).
 *       **Precondition**: Khách hàng phải có lịch hẹn COMPLETED cho BĐS này.
 *       - Status BĐS chuyển sang `NEGOTIATING`
 *       - Tự động gán Agent hiện tại
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - real_estate_id
 *               - client_id
 *               - offer_price
 *             properties:
 *               real_estate_id:
 *                 type: integer
 *               client_id:
 *                 type: integer
 *               offer_price:
 *                 type: number
 *                 example: 4800000000
 *               terms:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Danh sách Term IDs
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Validation error or precondition failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               no_appointment:
 *                 summary: No completed appointment
 *                 value:
 *                   success: false
 *                   message: Client must have a completed appointment for this property
 *               already_negotiating:
 *                 summary: Property already in negotiation
 *                 value:
 *                   success: false
 *                   message: This property is already in negotiation
 *
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     description: Lấy thông tin chi tiết giao dịch
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Transaction'
 *                     - type: object
 *                       properties:
 *                         real_estate:
 *                           $ref: '#/components/schemas/RealEstate'
 *                         client:
 *                           $ref: '#/components/schemas/Client'
 *                         staff:
 *                           $ref: '#/components/schemas/Staff'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   put:
 *     summary: Update transaction
 *     description: |
 *       Cập nhật giao dịch trong quá trình đàm phán (UC5.2).
 *       - Chỉ cho phép khi status = NEGOTIATING
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               offer_price:
 *                 type: number
 *               terms:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       400:
 *         description: Cannot update - not in negotiating status
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /transactions/{id}/finalize:
 *   put:
 *     summary: Finalize transaction
 *     description: |
 *       Hoàn tất đàm phán, chuyển sang giai đoạn hợp đồng (UC5.3).
 *       - Status chuyển sang `PENDING` (chờ hợp đồng)
 *       - Thông báo cho Legal Officer
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               final_price:
 *                 type: number
 *                 description: Giá cuối cùng thỏa thuận
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction finalized successfully
 *       400:
 *         description: Transaction not in negotiating status
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /transactions/{id}/cancel:
 *   put:
 *     summary: Cancel transaction
 *     description: |
 *       Hủy giao dịch (UC5.4).
 *       - Status chuyển sang `CANCELLED`
 *       - BĐS quay lại status `LISTED`
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Khách hàng thay đổi ý định
 *     responses:
 *       200:
 *         description: Transaction cancelled successfully
 *       400:
 *         description: Cannot cancel - already completed or cancelled
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

module.exports = {};
