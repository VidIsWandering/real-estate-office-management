/**
 * @swagger
 * /real-estates:
 *   get:
 *     summary: List all real estates
 *     description: Lấy danh sách bất động sản
 *     tags: [Real Estates]
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
 *           $ref: '#/components/schemas/RealEstateStatus'
 *       - in: query
 *         name: transaction_type
 *         schema:
 *           $ref: '#/components/schemas/TransactionType'
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Loại BĐS (căn hộ, nhà phố, đất,...)
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *       - in: query
 *         name: min_area
 *         schema:
 *           type: number
 *       - in: query
 *         name: max_area
 *         schema:
 *           type: number
 *       - in: query
 *         name: direction
 *         schema:
 *           $ref: '#/components/schemas/Direction'
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Tìm theo địa chỉ
 *       - in: query
 *         name: staff_id
 *         schema:
 *           type: integer
 *         description: Lọc theo Agent phụ trách
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tiêu đề, mô tả
 *     responses:
 *       200:
 *         description: List of real estates
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
 *                     $ref: '#/components/schemas/RealEstate'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *
 *   post:
 *     summary: Create new real estate
 *     description: |
 *       Thêm BĐS mới vào hệ thống (UC3.1).
 *       - Status ban đầu: `CREATED` hoặc `PENDING` (chờ kiểm tra pháp lý)
 *       - Tự động gán Agent hiện tại làm người phụ trách
 *     tags: [Real Estates]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - transaction_type
 *               - location
 *               - price
 *               - area
 *               - owner_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: Căn hộ cao cấp Vinhomes Central Park
 *               type:
 *                 type: string
 *                 example: Căn hộ
 *               transaction_type:
 *                 $ref: '#/components/schemas/TransactionType'
 *               location:
 *                 type: string
 *                 example: 208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM
 *               price:
 *                 type: number
 *                 example: 5000000000
 *               area:
 *                 type: number
 *                 example: 85.5
 *               description:
 *                 type: string
 *               direction:
 *                 $ref: '#/components/schemas/Direction'
 *               owner_id:
 *                 type: integer
 *                 description: ID của Client (chủ sở hữu)
 *               media_files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Hình ảnh, video BĐS
 *               legal_documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Giấy tờ pháp lý
 *     responses:
 *       201:
 *         description: Real estate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RealEstate'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 * /real-estates/{id}:
 *   get:
 *     summary: Get real estate by ID
 *     description: Lấy thông tin chi tiết của một BĐS
 *     tags: [Real Estates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Real estate details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/RealEstate'
 *                     - type: object
 *                       properties:
 *                         owner:
 *                           $ref: '#/components/schemas/Client'
 *                         assigned_agent:
 *                           $ref: '#/components/schemas/Staff'
 *                         media_files:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               url:
 *                                 type: string
 *                               type:
 *                                 type: string
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   put:
 *     summary: Update real estate
 *     description: |
 *       Cập nhật thông tin BĐS (UC3.3).
 *       - Nếu thay đổi giá, hệ thống sẽ lưu lịch sử giá
 *     tags: [Real Estates]
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
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *               transaction_type:
 *                 $ref: '#/components/schemas/TransactionType'
 *               location:
 *                 type: string
 *               price:
 *                 type: number
 *               area:
 *                 type: number
 *               description:
 *                 type: string
 *               direction:
 *                 $ref: '#/components/schemas/Direction'
 *               media_files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               legal_documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Real estate updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /real-estates/{id}/legal-check:
 *   put:
 *     summary: Legal check approval
 *     description: |
 *       Legal Officer kiểm tra và duyệt pháp lý BĐS (UC3.2).
 *       - Nếu approved: Status chuyển sang `LISTED`
 *       - Nếu rejected: Giữ nguyên `PENDING`, ghi chú lý do
 *     tags: [Real Estates]
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
 *               - is_approved
 *             properties:
 *               is_approved:
 *                 type: boolean
 *               note:
 *                 type: string
 *                 description: Ghi chú (bắt buộc nếu rejected)
 *     responses:
 *       200:
 *         description: Legal check completed
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /real-estates/{id}/status:
 *   patch:
 *     summary: Update real estate status
 *     description: |
 *       Thay đổi trạng thái BĐS (UC3.4).
 *       - Cho phép: LISTED ↔ SUSPENDED
 *     tags: [Real Estates]
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
 *                 type: string
 *                 enum: [listed, suspended]
 *               reason:
 *                 type: string
 *                 description: Lý do (nếu suspended)
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status transition
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /real-estates/{id}/price-history:
 *   get:
 *     summary: Get price history
 *     description: Xem lịch sử thay đổi giá của BĐS
 *     tags: [Real Estates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Price history
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
 *                       price:
 *                         type: number
 *                       changed_at:
 *                         type: string
 *                         format: date-time
 *                       changed_by:
 *                         type: integer
 */

module.exports = {};
