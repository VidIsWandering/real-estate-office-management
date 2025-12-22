/**
 * @swagger
 * /clients:
 *   get:
 *     summary: List all clients
 *     description: Lấy danh sách khách hàng
 *     tags: [Clients]
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
 *           $ref: '#/components/schemas/ClientType'
 *       - in: query
 *         name: staff_id
 *         schema:
 *           type: integer
 *         description: Lọc theo Agent phụ trách
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo tên, email, SĐT
 *     responses:
 *       200:
 *         description: List of clients
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
 *                     $ref: '#/components/schemas/Client'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *
 *   post:
 *     summary: Add new client
 *     description: |
 *       Thêm khách hàng tiềm năng mới (UC2.1).
 *       - Check trùng SĐT/Email trước khi tạo
 *       - Tự động gán Agent hiện tại làm người phụ trách
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - type
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Nguyễn Văn B
 *               email:
 *                 type: string
 *                 format: email
 *               phone_number:
 *                 type: string
 *                 example: '0912345678'
 *               address:
 *                 type: string
 *               type:
 *                 $ref: '#/components/schemas/ClientType'
 *               referral_src:
 *                 type: string
 *                 example: Facebook Ads
 *                 description: Nguồn giới thiệu
 *               requirement:
 *                 type: string
 *                 example: Tìm căn hộ 2PN, ngân sách 3 tỷ
 *                 description: Yêu cầu của khách hàng
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Phone number or email already exists
 *
 * /clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     description: Lấy thông tin chi tiết của một khách hàng
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   put:
 *     summary: Update client information
 *     description: Cập nhật thông tin khách hàng
 *     tags: [Clients]
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
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone_number:
 *                 type: string
 *               address:
 *                 type: string
 *               type:
 *                 $ref: '#/components/schemas/ClientType'
 *               referral_src:
 *                 type: string
 *               requirement:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   delete:
 *     summary: Delete client
 *     description: Xóa khách hàng (soft delete)
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /clients/{id}/notes:
 *   get:
 *     summary: Get contact history
 *     description: Xem lịch sử liên hệ/ghi chú của khách hàng (UC2.2)
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Contact history
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
 *                       content:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       created_by:
 *                         type: integer
 *
 *   post:
 *     summary: Add contact note
 *     description: Thêm ghi chú liên hệ cho khách hàng (UC2.2)
 *     tags: [Clients]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Khách hàng quan tâm căn hộ 2PN, hẹn xem nhà thứ 7
 *     responses:
 *       201:
 *         description: Note added successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

module.exports = {};
