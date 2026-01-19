/**
 * Config API Documentation
 */

/**
 * @swagger
 * tags:
 *   name: Config
 *   description: Configuration management (catalogs and permissions)
 */

/**
 * @swagger
 * /config/catalogs/{type}:
 *   get:
 *     summary: Get catalogs by type
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [property_type, area, lead_source, contract_type]
 *         description: Type of catalog to retrieve
 *     responses:
 *       200:
 *         description: Catalogs retrieved successfully
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
 *                   example: Catalogs retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Catalog'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /config/catalogs/{type}:
 *   post:
 *     summary: Create catalog item
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [property_type, area, lead_source, contract_type]
 *         description: Type of catalog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Căn hộ chung cư"
 *     responses:
 *       201:
 *         description: Catalog created successfully
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
 *                   example: Catalog created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Catalog'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /config/catalogs/{type}/{id}:
 *   put:
 *     summary: Update catalog item
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [property_type, area, lead_source, contract_type]
 *         description: Type of catalog
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Catalog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Căn hộ cao cấp"
 *     responses:
 *       200:
 *         description: Catalog updated successfully
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
 *                   example: Catalog updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Catalog'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /config/catalogs/{type}/{id}:
 *   delete:
 *     summary: Delete catalog item
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [property_type, area, lead_source, contract_type]
 *         description: Type of catalog
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Catalog ID
 *     responses:
 *       200:
 *         description: Catalog deleted successfully
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
 *                   example: Catalog deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /config/permissions:
 *   get:
 *     summary: Get all permissions as matrix
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
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
 *                   example: Permissions retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/PermissionMatrix'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /config/permissions/{position}:
 *   get:
 *     summary: Get permissions by position (role)
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: position
 *         required: true
 *         schema:
 *           type: string
 *           enum: [agent, legal_officer, accountant]
 *         description: Position (role) to get permissions for
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
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
 *                   example: Permissions retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/PositionPermissions'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /config/permissions:
 *   put:
 *     summary: Update permissions (bulk)
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermissionMatrix'
 *           example:
 *             agent:
 *               transactions:
 *                 view: true
 *                 add: true
 *                 edit: false
 *                 delete: false
 *               contracts:
 *                 view: false
 *                 add: true
 *                 edit: false
 *                 delete: false
 *             legal_officer:
 *               contracts:
 *                 view: true
 *                 add: true
 *                 edit: true
 *                 delete: false
 *     responses:
 *       200:
 *         description: Permissions updated successfully
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
 *                   example: Permissions updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/PermissionMatrix'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Catalog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           enum: [property_type, area, lead_source, contract_type]
 *           example: property_type
 *         value:
 *           type: string
 *           example: "Căn hộ chung cư"
 *         display_order:
 *           type: integer
 *           example: 1
 *         is_active:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     PermissionSet:
 *       type: object
 *       properties:
 *         view:
 *           type: boolean
 *         add:
 *           type: boolean
 *         edit:
 *           type: boolean
 *         delete:
 *           type: boolean
 *
 *     PositionPermissions:
 *       type: object
 *       properties:
 *         transactions:
 *           $ref: '#/components/schemas/PermissionSet'
 *         contracts:
 *           $ref: '#/components/schemas/PermissionSet'
 *         payments:
 *           $ref: '#/components/schemas/PermissionSet'
 *         properties:
 *           $ref: '#/components/schemas/PermissionSet'
 *         partners:
 *           $ref: '#/components/schemas/PermissionSet'
 *         staff:
 *           $ref: '#/components/schemas/PermissionSet'
 *
 *     PermissionMatrix:
 *       type: object
 *       properties:
 *         agent:
 *           $ref: '#/components/schemas/PositionPermissions'
 *         legal_officer:
 *           $ref: '#/components/schemas/PositionPermissions'
 *         accountant:
 *           $ref: '#/components/schemas/PositionPermissions'
 */

module.exports = {};
