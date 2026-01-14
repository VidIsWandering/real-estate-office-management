/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new account
 *     description: Đăng ký tài khoản mới (chỉ Manager/Admin mới có quyền tạo)
 *     tags: [Auth]
 *     security: []
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
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: agent01
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 format: password
 *                 example: SecurePass123
 *               full_name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 format: email
 *                 example: agent01@company.com
 *               phone_number:
 *                 type: string
 *                 example: '0901234567'
 *               role:
 *                 $ref: '#/components/schemas/StaffPosition'
 *     responses:
 *       201:
 *         description: Account created successfully
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
 *                   example: Account registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     account:
 *                       $ref: '#/components/schemas/Account'
 *                     staff:
 *                       $ref: '#/components/schemas/Staff'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Username or email already exists
 *
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: |
 *       Đăng nhập vào hệ thống.
 *       - Trả về access_token (expire: 7 ngày) và refresh_token (expire: 30 ngày)
 *       - Access token dùng cho các request API
 *       - Refresh token dùng để lấy access token mới khi hết hạn
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: agent01
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     account:
 *                       $ref: '#/components/schemas/Account'
 *                     staff:
 *                       $ref: '#/components/schemas/Staff'
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         access_token:
 *                           type: string
 *                         refresh_token:
 *                           type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Invalid username or password
 *       403:
 *         description: Account disabled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: Account is not active
 *
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Lấy thông tin profile của user đang đăng nhập
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
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
 *                     account:
 *                       $ref: '#/components/schemas/Account'
 *                     staff:
 *                       $ref: '#/components/schemas/Staff'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *   put:
 *     summary: Update current user profile
 *     description: Cập nhật thông tin cá nhân của user đang đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: Nguyễn Văn Updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated@example.com
 *               phone_number:
 *                 type: string
 *                 pattern: '^[0-9]{10,12}$'
 *                 example: '0912345678'
 *               address:
 *                 type: string
 *                 maxLength: 255
 *                 example: 123 Main Street, District 1
 *               assigned_area:
 *                 type: string
 *                 maxLength: 100
 *                 example: District 1, District 3
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     account:
 *                       $ref: '#/components/schemas/Account'
 *                     staff:
 *                       $ref: '#/components/schemas/Staff'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         description: Email already exists
 *
 * /auth/change-password:
 *   put:
 *     summary: Change password
 *     description: Đổi mật khẩu cho tài khoản hiện tại
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *             properties:
 *               old_password:
 *                 type: string
 *                 format: password
 *               new_password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Lấy access token mới bằng refresh token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
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
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @swagger
 * /auth/profile/avatar:
 *   post:
 *     summary: Upload profile avatar
 *     description: Upload avatar image for current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, WebP, max 5MB)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
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
 *                   example: Avatar uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatar:
 *                       type: string
 *                       example: /uploads/avatars/1-1768320171558.jpg
 *                     staff:
 *                       $ref: '#/components/schemas/Staff'
 *       400:
 *         description: No file uploaded or invalid file type
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/sessions:
 *   get:
 *     summary: Get all active sessions
 *     description: Get all active login sessions for current user
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
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
 *                   example: Sessions retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       ip_address:
 *                         type: string
 *                       user_agent:
 *                         type: string
 *                       device_info:
 *                         type: object
 *                       last_activity:
 *                         type: string
 *                         format: date-time
 *                       expires_at:
 *                         type: string
 *                         format: date-time
 *                       is_current:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/sessions/{id}:
 *   delete:
 *     summary: Revoke a specific session
 *     description: Logout from a specific session
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session revoked successfully
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
 *                   example: Session revoked successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     revoked:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */

/**
 * @swagger
 * /auth/sessions/revoke-all:
 *   post:
 *     summary: Revoke all sessions except current
 *     description: Logout from all other sessions
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               current_session_id:
 *                 type: integer
 *                 description: Current session ID to keep active (optional)
 *     responses:
 *       200:
 *         description: All sessions revoked successfully
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
 *                   example: All sessions revoked successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     revoked_count:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/login-history:
 *   get:
 *     summary: Get login history
 *     description: Get login/logout history for current user
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of records to return
 *     responses:
 *       200:
 *         description: Login history retrieved successfully
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
 *                   example: Login history retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       action_type:
 *                         type: string
 *                         enum: [LOGIN, LOGOUT, LOGIN_FAILED]
 *                       ip_address:
 *                         type: string
 *                       user_agent:
 *                         type: string
 *                       status:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/2fa/enable:
 *   post:
 *     summary: Enable 2FA (placeholder)
 *     description: Enable two-factor authentication (not fully implemented)
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       501:
 *         description: 2FA feature not yet implemented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 2FA feature not yet implemented - requires OTP library (speakeasy or otplib)
 */

/**
 * @swagger
 * /auth/2fa/disable:
 *   post:
 *     summary: Disable 2FA (placeholder)
 *     description: Disable two-factor authentication (not fully implemented)
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       501:
 *         description: 2FA feature not yet implemented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 2FA feature not yet implemented - requires OTP library (speakeasy or otplib)
 */

/**
 * @swagger
 * /auth/2fa/verify:
 *   post:
 *     summary: Verify 2FA token (placeholder)
 *     description: Verify two-factor authentication token (not fully implemented)
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "123456"
 *     responses:
 *       501:
 *         description: 2FA feature not yet implemented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 2FA feature not yet implemented - requires OTP library (speakeasy or otplib)
 */

module.exports = {};
