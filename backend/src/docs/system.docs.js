/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get system logs
 *     description: |
 *       Xem nhật ký hoạt động hệ thống (UC9.3).
 *       **Chỉ Manager/Admin có quyền.**
 *     tags: [System]
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
 *           default: 50
 *       - in: query
 *         name: actor_id
 *         schema:
 *           type: integer
 *         description: Lọc theo người thực hiện
 *       - in: query
 *         name: action_type
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, LOGIN, LOGOUT, STATUS_CHANGE]
 *       - in: query
 *         name: target_type
 *         schema:
 *           type: string
 *           enum: [staff, client, real_estate, appointment, transaction, contract, voucher]
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: System logs
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
 *                       id:
 *                         type: integer
 *                       actor_id:
 *                         type: integer
 *                       actor_name:
 *                         type: string
 *                       action_type:
 *                         type: string
 *                       target_type:
 *                         type: string
 *                       target_id:
 *                         type: string
 *                       details:
 *                         type: object
 *                         description: Chi tiết thay đổi
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       ip_address:
 *                         type: string
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 * /system/config:
 *   get:
 *     summary: Get system configuration
 *     description: |
 *       Lấy cấu hình hệ thống hiện tại.
 *       **Chỉ Manager/Admin có quyền.**
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System configuration
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
 *                     company_name:
 *                       type: string
 *                       example: Công ty BĐS ABC
 *                     company_address:
 *                       type: string
 *                     company_phone:
 *                       type: string
 *                     company_email:
 *                       type: string
 *                     working_hours:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                           example: '08:00'
 *                         end:
 *                           type: string
 *                           example: '17:30'
 *                     appointment_duration_default:
 *                       type: integer
 *                       description: Thời lượng mặc định lịch hẹn (phút)
 *                       example: 60
 *                     notification_settings:
 *                       type: object
 *                       properties:
 *                         email_enabled:
 *                           type: boolean
 *                         sms_enabled:
 *                           type: boolean
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 *   put:
 *     summary: Update system configuration
 *     description: |
 *       Cập nhật cấu hình hệ thống (UC9.4).
 *       **Chỉ Admin có quyền.**
 *     tags: [System]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_name:
 *                 type: string
 *               company_address:
 *                 type: string
 *               company_phone:
 *                 type: string
 *               company_email:
 *                 type: string
 *               working_hours:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                   end:
 *                     type: string
 *               appointment_duration_default:
 *                 type: integer
 *               notification_settings:
 *                 type: object
 *                 properties:
 *                   email_enabled:
 *                     type: boolean
 *                   sms_enabled:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Configuration updated successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 * /terms:
 *   get:
 *     summary: Get all terms
 *     description: Lấy danh sách các điều khoản mẫu
 *     tags: [System]
 *     responses:
 *       200:
 *         description: List of terms
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
 *                       name:
 *                         type: string
 *                         example: Thanh toán lần 1
 *                       content:
 *                         type: string
 *                         example: Thanh toán 30% khi ký hợp đồng
 *
 *   post:
 *     summary: Create term
 *     description: Tạo điều khoản mẫu mới
 *     tags: [System]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - content
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Term created successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 * /terms/{id}:
 *   put:
 *     summary: Update term
 *     description: Cập nhật điều khoản mẫu
 *     tags: [System]
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
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Term updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   delete:
 *     summary: Delete term
 *     description: Xóa điều khoản mẫu
 *     tags: [System]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Term deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

module.exports = {};
