/**
 * @swagger
 * /contracts:
 *   get:
 *     summary: List contracts
 *     description: Lấy danh sách hợp đồng
 *     tags: [Contracts]
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
 *           $ref: '#/components/schemas/ContractStatus'
 *       - in: query
 *         name: type
 *         schema:
 *           $ref: '#/components/schemas/ContractType'
 *       - in: query
 *         name: staff_id
 *         schema:
 *           type: integer
 *         description: Lọc theo Legal Officer
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Lọc theo effective_date từ ngày
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Lọc theo effective_date đến ngày
 *     responses:
 *       200:
 *         description: List of contracts
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
 *                     $ref: '#/components/schemas/Contract'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *
 *   post:
 *     summary: Create contract
 *     description: |
 *       Tạo hợp đồng mới (UC6.1).
 *       - Status ban đầu: `DRAFT`
 *       - Chỉ Legal Officer có quyền
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transaction_id
 *               - type
 *               - party_a
 *               - party_b
 *               - total_value
 *               - effective_date
 *             properties:
 *               transaction_id:
 *                 type: integer
 *               type:
 *                 $ref: '#/components/schemas/ContractType'
 *               party_a:
 *                 type: integer
 *                 description: Client ID - Bên A (người mua/thuê)
 *               party_b:
 *                 type: integer
 *                 description: Client ID - Bên B (người bán/cho thuê)
 *               total_value:
 *                 type: number
 *                 example: 5000000000
 *               deposit_amount:
 *                 type: number
 *                 example: 500000000
 *               payment_terms:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Term IDs cho điều khoản thanh toán
 *               effective_date:
 *                 type: string
 *                 format: date
 *               expiration_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Contract created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Contract'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 * /contracts/{id}:
 *   get:
 *     summary: Get contract by ID
 *     description: Lấy thông tin chi tiết hợp đồng
 *     tags: [Contracts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contract details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Contract'
 *                     - type: object
 *                       properties:
 *                         transaction:
 *                           $ref: '#/components/schemas/Transaction'
 *                         party_a_info:
 *                           $ref: '#/components/schemas/Client'
 *                         party_b_info:
 *                           $ref: '#/components/schemas/Client'
 *                         legal_officer:
 *                           $ref: '#/components/schemas/Staff'
 *                         attachments:
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
 *     summary: Update contract
 *     description: |
 *       Cập nhật hợp đồng.
 *       - Chỉ cho phép khi status = DRAFT
 *     tags: [Contracts]
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
 *               type:
 *                 $ref: '#/components/schemas/ContractType'
 *               total_value:
 *                 type: number
 *               deposit_amount:
 *                 type: number
 *               payment_terms:
 *                 type: array
 *                 items:
 *                   type: integer
 *               effective_date:
 *                 type: string
 *                 format: date
 *               expiration_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Contract updated successfully
 *       400:
 *         description: Cannot update - not in draft status
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /contracts/{id}/status:
 *   patch:
 *     summary: Update contract status
 *     description: |
 *       Cập nhật trạng thái hợp đồng (UC6.2).
 *
 *       Workflow:
 *       - DRAFT → PENDING (gửi cho các bên ký)
 *       - PENDING → SIGNED (đã ký)
 *       - SIGNED → NOTARIZED (đã công chứng)
 *       - NOTARIZED → FINALIZED (hoàn tất)
 *       - Bất kỳ → CANCELLED (hủy)
 *     tags: [Contracts]
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
 *               - status
 *             properties:
 *               status:
 *                 $ref: '#/components/schemas/ContractStatus'
 *               signed_date:
 *                 type: string
 *                 format: date
 *                 description: Ngày ký (khi chuyển sang SIGNED)
 *               cancellation_reason:
 *                 type: string
 *                 description: Lý do hủy (khi chuyển sang CANCELLED)
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status transition
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /contracts/{id}/files:
 *   post:
 *     summary: Upload contract files
 *     description: |
 *       Upload tài liệu hợp đồng (UC6.3).
 *       - Hợp đồng đã ký, công chứng,...
 *     tags: [Contracts]
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
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       url:
 *                         type: string
 *                       name:
 *                         type: string
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   get:
 *     summary: Get contract files
 *     description: Lấy danh sách tài liệu đính kèm của hợp đồng
 *     tags: [Contracts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of files
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

module.exports = {};
