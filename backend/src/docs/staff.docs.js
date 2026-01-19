/**
 * @swagger
 * /staff:
 *   get:
 *     summary: List all staff
 *     description: |
 *       Lấy danh sách nhân viên.
 *       - Manager/Admin: Xem được tất cả
 *       - Agent/Staff: Chỉ xem được thông tin cơ bản
 *     tags: [Staff]
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
 *         name: position
 *         schema:
 *           $ref: '#/components/schemas/StaffPosition'
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/StaffStatus'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo tên, email, SĐT
 *     responses:
 *       200:
 *         description: List of staff
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
 *                     $ref: '#/components/schemas/Staff'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *   post:
 *     summary: Create new staff
 *     description: |
 *       Tạo nhân viên mới (UC1.1).
 *       **Chỉ Manager/Admin có quyền.**
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - full_name
 *               - position
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 minLength: 6
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone_number:
 *                 type: string
 *               address:
 *                 type: string
 *               assigned_area:
 *                 type: string
 *                 description: Khu vực phụ trách (cho Agent)
 *               role:
 *                 $ref: '#/components/schemas/StaffPosition'
 *     responses:
 *       201:
 *         description: Staff created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Staff'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Username/Email already exists
 *
 * /staff/{id}:
 *   get:
 *     summary: Get staff by ID
 *     description: Lấy thông tin chi tiết của một nhân viên
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Staff details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Staff'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   put:
 *     summary: Update staff information
 *     description: |
 *       Cập nhật thông tin nhân viên (UC1.1).
 *       **Chỉ Manager/Admin có quyền.**
 *     tags: [Staff]
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
 *               assigned_area:
 *                 type: string
 *               role:
 *                 $ref: '#/components/schemas/StaffPosition'
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   delete:
 *     summary: Delete staff member
 *     description: |
 *       Xóa nhân viên (soft delete - set status thành off_duty).
 *       **Chỉ Manager/Admin có quyền.**
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Staff deleted successfully
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
 *                   example: Staff deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Staff deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Internal server error
 *
 * /staff/{id}/status:
 *   patch:
 *     summary: Activate/Deactivate staff
 *     description: |
 *       Kích hoạt hoặc vô hiệu hóa nhân viên (UC1.1).
 *       **Chỉ Manager/Admin có quyền.**
 *     tags: [Staff]
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
 *                 $ref: '#/components/schemas/StaffStatus'
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /staff/{id}/permissions:
 *   put:
 *     summary: Update staff permissions
 *     description: |
 *       Cập nhật quyền hạn cho nhân viên (UC9.1).
 *       **Chỉ Manager/Admin có quyền.**
 *     tags: [Staff]
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
 *               - position
 *             properties:
 *               role:
 *                 $ref: '#/components/schemas/StaffPosition'
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách quyền cụ thể (optional, cho future use)
 *     responses:
 *       200:
 *         description: Permissions updated successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

module.exports = {};
