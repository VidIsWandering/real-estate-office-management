/**
 * @swagger
 * /vouchers:
 *   get:
 *     summary: List vouchers
 *     description: |
 *       Lấy danh sách chứng từ thu chi.
 *       - Accountant: Xem tất cả
 *       - Agent: Xem chứng từ liên quan đến giao dịch của mình
 *     tags: [Vouchers]
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
 *         name: type
 *         schema:
 *           $ref: '#/components/schemas/VoucherType'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [created, confirmed]
 *       - in: query
 *         name: contract_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: payment_method
 *         schema:
 *           $ref: '#/components/schemas/PaymentMethod'
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of vouchers
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
 *                     $ref: '#/components/schemas/Voucher'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *
 *   post:
 *     summary: Create voucher
 *     description: |
 *       Tạo chứng từ thu/chi (UC7.1, UC7.3).
 *       - RECEIPT: Phiếu thu (tiền từ khách hàng)
 *       - PAYMENT: Phiếu chi (thanh toán cho chủ BĐS, chi phí...)
 *       - Nếu có contract_id: Tự động cập nhật paid_amount của Contract
 *     tags: [Vouchers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - party
 *               - amount
 *               - payment_method
 *               - payment_time
 *             properties:
 *               contract_id:
 *                 type: integer
 *                 description: ID hợp đồng liên quan (optional)
 *               type:
 *                 $ref: '#/components/schemas/VoucherType'
 *               party:
 *                 type: string
 *                 example: Nguyễn Văn A
 *                 description: Tên bên thanh toán/nhận tiền
 *               amount:
 *                 type: number
 *                 example: 500000000
 *               payment_method:
 *                 $ref: '#/components/schemas/PaymentMethod'
 *               payment_time:
 *                 type: string
 *                 format: date-time
 *               payment_description:
 *                 type: string
 *                 example: Thanh toán đợt 1 theo hợp đồng
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Ảnh chụp biên lai, ủy nhiệm chi,...
 *     responses:
 *       201:
 *         description: Voucher created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Voucher'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 * /vouchers/{id}:
 *   get:
 *     summary: Get voucher by ID
 *     description: Lấy thông tin chi tiết chứng từ
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voucher details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Voucher'
 *                     - type: object
 *                       properties:
 *                         contract:
 *                           $ref: '#/components/schemas/Contract'
 *                         accountant:
 *                           $ref: '#/components/schemas/Staff'
 *                         attachments_detail:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               url:
 *                                 type: string
 *                               name:
 *                                 type: string
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   put:
 *     summary: Update voucher
 *     description: |
 *       Cập nhật chứng từ.
 *       - Chỉ cho phép khi status = CREATED
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               party:
 *                 type: string
 *               amount:
 *                 type: number
 *               payment_method:
 *                 $ref: '#/components/schemas/PaymentMethod'
 *               payment_time:
 *                 type: string
 *                 format: date-time
 *               payment_description:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Voucher updated successfully
 *       400:
 *         description: Cannot update - already confirmed
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /vouchers/{id}/confirm:
 *   patch:
 *     summary: Confirm voucher
 *     description: |
 *       Xác nhận chứng từ.
 *       - Status chuyển sang CONFIRMED
 *       - Không thể sửa đổi sau khi xác nhận
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voucher confirmed successfully
 *       400:
 *         description: Already confirmed
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /debts:
 *   get:
 *     summary: Get outstanding debts
 *     description: |
 *       Lấy danh sách công nợ (UC7.2).
 *       - Trả về các hợp đồng có remaining_amount > 0
 *     tags: [Vouchers]
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
 *         name: min_amount
 *         schema:
 *           type: number
 *         description: Lọc công nợ tối thiểu
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [amount_asc, amount_desc, date_asc, date_desc]
 *     responses:
 *       200:
 *         description: List of outstanding debts
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
 *                       contract_id:
 *                         type: integer
 *                       contract_type:
 *                         $ref: '#/components/schemas/ContractType'
 *                       total_value:
 *                         type: number
 *                       paid_amount:
 *                         type: number
 *                       remaining_amount:
 *                         type: number
 *                       party_a:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           full_name:
 *                             type: string
 *                       party_b:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           full_name:
 *                             type: string
 *                       effective_date:
 *                         type: string
 *                         format: date
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total_debt:
 *                       type: number
 *                     count:
 *                       type: integer
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

module.exports = {};
