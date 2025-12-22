/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: List appointments
 *     description: |
 *       Lấy danh sách lịch hẹn (UC4.3).
 *       - Agent: Chỉ xem lịch của mình
 *       - Manager: Xem được tất cả, có thể filter theo staff_id
 *     tags: [Appointments]
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
 *           $ref: '#/components/schemas/AppointmentStatus'
 *       - in: query
 *         name: staff_id
 *         schema:
 *           type: integer
 *         description: Lọc theo Agent (chỉ Manager)
 *       - in: query
 *         name: client_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: real_estate_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Lọc từ ngày
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Lọc đến ngày
 *     responses:
 *       200:
 *         description: List of appointments
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
 *                     allOf:
 *                       - $ref: '#/components/schemas/Appointment'
 *                       - type: object
 *                         properties:
 *                           real_estate:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               title:
 *                                 type: string
 *                           client:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               full_name:
 *                                 type: string
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *
 *   post:
 *     summary: Create appointment
 *     description: |
 *       Tạo lịch hẹn xem BĐS (UC4.1).
 *       - Validate: Check xung đột lịch của Agent (QĐ4)
 *       - Tự động gán Agent hiện tại
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - real_estate_id
 *               - client_id
 *               - start_time
 *               - end_time
 *             properties:
 *               real_estate_id:
 *                 type: integer
 *               client_id:
 *                 type: integer
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-01-15T09:00:00+07:00'
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-01-15T10:00:00+07:00'
 *               location:
 *                 type: string
 *                 description: Địa điểm hẹn (mặc định là địa chỉ BĐS)
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error or schedule conflict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               schedule_conflict:
 *                 summary: Schedule conflict
 *                 value:
 *                   success: false
 *                   message: Agent has another appointment at this time
 *               invalid_time:
 *                 summary: Invalid time range
 *                 value:
 *                   success: false
 *                   message: End time must be after start time
 *
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     description: Lấy thông tin chi tiết lịch hẹn
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Appointment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Appointment'
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
 *     summary: Update appointment
 *     description: Cập nhật thông tin lịch hẹn
 *     tags: [Appointments]
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
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       400:
 *         description: Schedule conflict
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status
 *     description: |
 *       Cập nhật trạng thái lịch hẹn (UC4.2).
 *       - CREATED → CONFIRMED: Xác nhận lịch hẹn
 *       - CREATED/CONFIRMED → CANCELLED: Hủy lịch hẹn
 *       - CONFIRMED → COMPLETED: Hoàn thành lịch hẹn
 *     tags: [Appointments]
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
 *                 $ref: '#/components/schemas/AppointmentStatus'
 *               result_note:
 *                 type: string
 *                 description: Ghi chú kết quả (khi COMPLETED)
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status transition
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

module.exports = {};
