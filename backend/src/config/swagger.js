/**
 * Swagger/OpenAPI Configuration
 * Tự động generate API documentation từ JSDoc comments
 */

const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./environment');

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Real Estate Management System API',
    version: '1.0.0',
    description: `
## 📋 Overview
API Backend cho hệ thống Quản lý Văn phòng Bất động sản (SE100).

## 🏗️ Architecture
Layered Architecture với Service-Repository Pattern (Controller → Service → Repository → Model).

## 🔐 Authentication
Sử dụng JWT Bearer Token. Gọi \`/api/v1/auth/login\` để lấy token, sau đó thêm vào header:
\`\`\`
Authorization: Bearer <your_access_token>
\`\`\`

## 👥 Staff Positions (per context_design.md)
- **Manager**: Quản lý nhân viên, xem báo cáo, logs
- **Agent**: Quản lý BĐS, khách hàng, lịch hẹn, giao dịch
- **Legal Officer**: Kiểm tra pháp lý, xử lý hợp đồng
- **Accountant**: Quản lý chứng từ thu chi
    `,
    contact: {
      name: 'SE100 Team',
      email: 'support@se100.local',
    },
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}${config.api_prefix}`,
      description: 'Development Server',
    },
    {
      url: 'https://api.se100.example.com/api/v1',
      description: 'Production Server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication & Authorization' },
    { name: 'Staff', description: 'Staff Management (Manager only)' },
    { name: 'Clients', description: 'Client Management' },
    { name: 'Real Estates', description: 'Property Management' },
    { name: 'Appointments', description: 'Appointment Scheduling' },
    { name: 'Transactions', description: 'Transaction & Negotiation' },
    { name: 'Contracts', description: 'Contract Management' },
    { name: 'Vouchers', description: 'Payment & Receipts' },
    { name: 'Reports', description: 'Reporting & Analytics' },
    { name: 'System', description: 'System Configuration & Logs' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token',
      },
    },
    schemas: {
      // ========== Common Schemas ==========
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error message' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 100 },
          totalPages: { type: 'integer', example: 10 },
        },
      },

      // ========== Enums (aligned with context_design.md) ==========
      StaffPosition: {
        type: 'string',
        enum: ['manager', 'agent', 'legal_officer', 'accountant'],
        description: 'Vị trí nhân viên (per context_design.md)',
      },
      StaffStatus: {
        type: 'string',
        enum: ['working', 'off_duty'],
        description: 'Trạng thái làm việc',
      },
      ClientType: {
        type: 'string',
        enum: ['buyer', 'seller', 'landlord', 'tenant'],
        description: 'Loại khách hàng',
      },
      TransactionType: {
        type: 'string',
        enum: ['sale', 'rent'],
        description: 'Loại giao dịch BĐS',
      },
      Direction: {
        type: 'string',
        enum: [
          'north',
          'south',
          'east',
          'west',
          'northeast',
          'northwest',
          'southeast',
          'southwest',
        ],
        description: 'Hướng nhà',
      },
      RealEstateStatus: {
        type: 'string',
        enum: [
          'created',
          'pending_legal_check',
          'listed',
          'negotiating',
          'transacted',
          'suspended',
        ],
        description: 'Trạng thái BĐS (per context_design.md)',
      },
      AppointmentStatus: {
        type: 'string',
        enum: ['created', 'confirmed', 'completed', 'cancelled'],
        description: 'Trạng thái lịch hẹn',
      },
      TransactionStatus: {
        type: 'string',
        enum: ['negotiating', 'pending_contract', 'cancelled'],
        description: 'Trạng thái giao dịch (per context_design.md)',
      },
      ContractType: {
        type: 'string',
        enum: ['deposit', 'purchase', 'lease'],
        description: 'Loại hợp đồng',
      },
      ContractStatus: {
        type: 'string',
        enum: [
          'draft',
          'pending_signature',
          'signed',
          'notarized',
          'finalized',
          'cancelled',
        ],
        description: 'Trạng thái hợp đồng (per context_design.md)',
      },
      VoucherType: {
        type: 'string',
        enum: ['receipt', 'payment'],
        description: 'Loại chứng từ',
      },
      PaymentMethod: {
        type: 'string',
        enum: ['cash', 'bank_transfer'],
        description: 'Phương thức thanh toán',
      },

      // ========== Entity Schemas ==========
      Account: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          username: { type: 'string', example: 'agent01' },
          is_active: {
            type: 'boolean',
            example: true,
            description: 'Account active status',
          },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Staff: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          account_id: { type: 'integer', example: 1 },
          full_name: { type: 'string', example: 'Nguyễn Văn A' },
          email: {
            type: 'string',
            format: 'email',
            example: 'agent@example.com',
          },
          phone_number: { type: 'string', example: '0901234567' },
          address: { type: 'string', example: '123 Đường ABC, Q.1, TP.HCM' },
          assigned_area: { type: 'string', example: 'Quận 1, 3, 5' },
          position: { $ref: '#/components/schemas/StaffPosition' },
          status: { $ref: '#/components/schemas/StaffStatus' },
        },
      },
      Client: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          full_name: { type: 'string', example: 'Trần Thị B' },
          email: { type: 'string', format: 'email' },
          phone_number: { type: 'string', example: '0912345678' },
          address: { type: 'string' },
          type: { $ref: '#/components/schemas/ClientType' },
          referral_src: { type: 'string', example: 'Facebook Ads' },
          requirement: { type: 'string', example: 'Tìm căn hộ 2PN, Q.2' },
          staff_id: { type: 'integer', description: 'Agent phụ trách' },
        },
      },
      RealEstate: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: {
            type: 'string',
            example: 'Căn hộ cao cấp Vinhomes Central Park',
          },
          type: { type: 'string', example: 'Căn hộ' },
          transaction_type: { $ref: '#/components/schemas/TransactionType' },
          location: {
            type: 'string',
            example: '208 Nguyễn Hữu Cảnh, Bình Thạnh',
          },
          price: { type: 'number', example: 5000000000 },
          area: { type: 'number', example: 85.5, description: 'm²' },
          description: { type: 'string' },
          direction: { $ref: '#/components/schemas/Direction' },
          owner_id: { type: 'integer' },
          staff_id: { type: 'integer', description: 'Agent phụ trách' },
          status: { $ref: '#/components/schemas/RealEstateStatus' },
        },
      },
      Appointment: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          real_estate_id: { type: 'integer' },
          client_id: { type: 'integer' },
          staff_id: { type: 'integer' },
          start_time: { type: 'string', format: 'date-time' },
          end_time: { type: 'string', format: 'date-time' },
          location: { type: 'string' },
          status: { $ref: '#/components/schemas/AppointmentStatus' },
          note: { type: 'string' },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          real_estate_id: { type: 'integer' },
          client_id: { type: 'integer' },
          staff_id: { type: 'integer' },
          offer_price: { type: 'number', example: 4800000000 },
          terms: { type: 'array', items: { type: 'integer' } },
          status: { $ref: '#/components/schemas/TransactionStatus' },
          cancellation_reason: { type: 'string' },
        },
      },
      Contract: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          transaction_id: { type: 'integer' },
          type: { $ref: '#/components/schemas/ContractType' },
          party_a: { type: 'integer', description: 'Client ID - Bên A' },
          party_b: { type: 'integer', description: 'Client ID - Bên B' },
          total_value: { type: 'number', example: 5000000000 },
          deposit_amount: { type: 'number', example: 500000000 },
          paid_amount: { type: 'number', example: 500000000 },
          remaining_amount: { type: 'number', example: 4500000000 },
          signed_date: { type: 'string', format: 'date' },
          effective_date: { type: 'string', format: 'date' },
          expiration_date: { type: 'string', format: 'date' },
          status: { $ref: '#/components/schemas/ContractStatus' },
          staff_id: { type: 'integer', description: 'Legal Officer phụ trách' },
        },
      },
      Voucher: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          contract_id: { type: 'integer' },
          type: { $ref: '#/components/schemas/VoucherType' },
          party: { type: 'string', example: 'Nguyễn Văn A' },
          payment_time: { type: 'string', format: 'date-time' },
          amount: { type: 'number', example: 500000000 },
          payment_method: { $ref: '#/components/schemas/PaymentMethod' },
          payment_description: { type: 'string' },
          staff_id: { type: 'integer', description: 'Accountant phụ trách' },
          status: { type: 'string', enum: ['created', 'confirmed'] },
        },
      },
      // ========== New Schemas (per context_design.md) ==========
      ClientNote: {
        type: 'object',
        description: 'Contact history/notes for clients (UC2.2)',
        properties: {
          id: { type: 'integer', example: 1 },
          client_id: { type: 'integer' },
          staff_id: {
            type: 'integer',
            description: 'Staff who added the note',
          },
          content: {
            type: 'string',
            example: 'Đã gọi điện tư vấn, KH quan tâm căn 2PN',
          },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      AuditLog: {
        type: 'object',
        description: 'System activity log for auditing (UC9.3)',
        properties: {
          id: { type: 'integer', example: 1 },
          actor_id: {
            type: 'integer',
            description: 'Staff who performed the action',
          },
          action_type: {
            type: 'string',
            enum: [
              'create',
              'update',
              'delete',
              'status_change',
              'login',
              'logout',
              'export',
              'approve',
              'reject',
            ],
          },
          target_type: {
            type: 'string',
            example: 'contract',
            description: 'Entity type affected',
          },
          target_id: { type: 'integer', example: 123 },
          details: {
            type: 'object',
            description: 'Additional JSON data about the action',
          },
          ip_address: { type: 'string', example: '192.168.1.1' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      ActionType: {
        type: 'string',
        enum: [
          'create',
          'update',
          'delete',
          'status_change',
          'login',
          'logout',
          'export',
          'approve',
          'reject',
        ],
        description: 'Type of action for audit log',
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Authentication required or token invalid',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'No token provided',
            },
          },
        },
      },
      ForbiddenError: {
        description: 'User does not have permission',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'You do not have permission to access this resource',
            },
          },
        },
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Resource not found',
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation failed',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              success: false,
              message: 'Validation failed',
              errors: [{ field: 'email', message: 'Invalid email format' }],
            },
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions (JSDoc comments)
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/docs/*.js', // Dedicated docs folder
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
