# Settings Page API Documentation

## Overview

Backend APIs cho Settings Page (Cấu hình hệ thống) của ứng dụng quản lý văn phòng bất động sản.

**Base URL**: `/api/v1`

**Authentication**: Tất cả endpoints yêu cầu Bearer token authentication

**Authorization**: Chỉ Manager và Admin có quyền truy cập

---

## 📋 Catalog Management API

Quản lý các danh mục cấu hình: loại BĐS, khu vực, nguồn lead, loại hợp đồng.

### Get Catalogs by Type

```http
GET /config/catalogs/{type}
```

**Parameters:**

- `type`: `property_type` | `area` | `lead_source` | `contract_type`

**Response 200:**

```json
{
  "success": true,
  "message": "Catalogs retrieved successfully",
  "data": [
    {
      "id": 1,
      "type": "property_type",
      "value": "Căn hộ chung cư",
      "display_order": 1,
      "is_active": true,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### Create Catalog Item

```http
POST /config/catalogs/{type}
```

**Request Body:**

```json
{
  "value": "Căn hộ cao cấp"
}
```

**Response 201:**

```json
{
  "success": true,
  "message": "Catalog created successfully",
  "data": {
    "id": 5,
    "type": "property_type",
    "value": "Căn hộ cao cấp",
    "display_order": 999,
    "is_active": true
  }
}
```

**Error Responses:**

- `400`: Value already exists, empty value, or invalid type
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (not Manager/Admin)

### Update Catalog Item

```http
PUT /config/catalogs/{type}/{id}
```

**Request Body:**

```json
{
  "value": "Căn hộ siêu sang"
}
```

**Response 200:**

```json
{
  "success": true,
  "message": "Catalog updated successfully",
  "data": {
    "id": 5,
    "value": "Căn hộ siêu sang"
  }
}
```

**Error Responses:**

- `400`: Value already exists or empty
- `404`: Catalog item not found or inactive

### Delete Catalog Item

```http
DELETE /config/catalogs/{type}/{id}
```

**Response 200:**

```json
{
  "success": true,
  "message": "Catalog deleted successfully",
  "data": {
    "id": 5
  }
}
```

**Note**: Soft delete - sets `is_active = false`

---

## 🔐 Permission Management API

Quản lý quyền truy cập theo vai trò (agent, legal_officer, accountant).

### Get All Permissions (Matrix)

```http
GET /config/permissions
```

**Response 200:**

```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": {
    "agent": {
      "transactions": {
        "view": true,
        "add": true,
        "edit": false,
        "delete": false
      },
      "contracts": {
        "view": false,
        "add": true,
        "edit": false,
        "delete": false
      }
    },
    "legal_officer": {
      "contracts": {
        "view": true,
        "add": true,
        "edit": true,
        "delete": false
      }
    },
    "accountant": {
      "payments": {
        "view": true,
        "add": true,
        "edit": true,
        "delete": true
      }
    }
  }
}
```

### Get Permissions by Position

```http
GET /config/permissions/{position}
```

**Parameters:**

- `position`: `agent` | `legal_officer` | `accountant`

**Response 200:**

```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": {
    "transactions": {
      "view": true,
      "add": true,
      "edit": false,
      "delete": false
    },
    "contracts": {
      "view": false,
      "add": true,
      "edit": false,
      "delete": false
    }
  }
}
```

### Update Permissions (Bulk)

```http
PUT /config/permissions
```

**Request Body:**

```json
{
  "agent": {
    "transactions": {
      "view": true,
      "add": true,
      "edit": false,
      "delete": false
    },
    "contracts": {
      "view": false,
      "add": true,
      "edit": false,
      "delete": false
    }
  },
  "legal_officer": {
    "contracts": {
      "view": true,
      "add": true,
      "edit": true,
      "delete": false
    }
  }
}
```

**Response 200:**

```json
{
  "success": true,
  "message": "Permissions updated successfully",
  "data": {
    // Same structure as request
  }
}
```

**Error Responses:**

- `400`: Invalid position, resource, permission, or non-boolean value
- `401`: Unauthorized
- `403`: Forbidden

---

## ⚙️ System Configuration API

Quản lý cấu hình hệ thống chung.

### Get System Configuration

```http
GET /system/config
```

**Authorization**: Manager or Admin

**Response 200:**

```json
{
  "success": true,
  "message": "System config retrieved successfully",
  "data": {
    "company_name": "Công ty BĐS ABC",
    "company_address": "123 Đường ABC, Quận 1, TP.HCM",
    "company_phone": "0901234567",
    "company_email": "contact@abc.com",
    "working_hours": {
      "start": "08:00",
      "end": "17:30"
    },
    "appointment_duration_default": 60,
    "notification_settings": {
      "email_enabled": true,
      "sms_enabled": false
    }
  }
}
```

### Update System Configuration

```http
PUT /system/config
```

**Authorization**: Admin only

**Request Body:** (all fields optional)

```json
{
  "company_name": "Công ty BĐS XYZ",
  "company_phone": "0909999999",
  "appointment_duration_default": 90,
  "notification_settings": {
    "email_enabled": true,
    "sms_enabled": true
  }
}
```

**Response 200:**

```json
{
  "success": true,
  "message": "System config updated successfully",
  "data": {
    // Updated configuration
  }
}
```

---

## 📊 Data Models

### Catalog Types

```
property_type    - Loại bất động sản (Căn hộ, Nhà phố, Đất nền,...)
area             - Khu vực (Quận 1, Quận 2,...)
lead_source      - Nguồn khách hàng (Website, Facebook, Giới thiệu,...)
contract_type    - Loại hợp đồng (Mua bán, Cho thuê,...)
```

### Positions (Roles)

```
agent            - Nhân viên sale
legal_officer    - Nhân viên pháp lý
accountant       - Kế toán
```

### Resources

```
transactions     - Giao dịch
contracts        - Hợp đồng
payments         - Thanh toán
properties       - Bất động sản
partners         - Đối tác (khách hàng)
staff            - Nhân viên
```

### Permissions

```
view             - Xem
add              - Thêm mới
edit             - Chỉnh sửa
delete           - Xóa
```

---

## 🔒 Security

### Authentication

- All endpoints require Bearer token in `Authorization` header
- Token format: `Bearer <jwt_token>`
- Tokens expire after configured duration

### Authorization

- **Manager & Admin**: Full access to catalog and permission management
- **Admin only**: System configuration updates
- **Agent**: No access to Settings Page APIs

### Input Validation

- All inputs are sanitized and validated
- XSS protection via input escaping
- SQL injection prevention via parameterized queries
- CSRF protection via token validation

### Rate Limiting

- Recommended: 100 requests/minute per user
- Implement at API gateway level

---

## 🧪 Testing

### Test Coverage

- **Unit Tests**: 24 tests (services, repositories)
- **Integration Tests**: 39 tests (API endpoints)
- **Total**: 95 tests passing (100%)

### Run Tests

```bash
npm test                          # All tests
npm test -- config.api.test.js    # Integration tests
npm test -- config.service.test.js # Unit tests
```

---

## 🐛 Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message description"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error, duplicate value)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (database constraint violation)
- `500`: Internal Server Error

### Common Error Messages

```
"Invalid catalog type: {type}"
"Value is required"
"Value already exists for {type}"
"Catalog item not found"
"Invalid position: {position}"
"Invalid resource: {resource}"
"Invalid permission: {permission}"
```

---

## 📝 Code Structure

```
backend/src/
├── controllers/
│   ├── config.controller.js       # HTTP request handlers
│   └── system.controller.js
├── services/
│   ├── config.service.js          # Business logic
│   └── system.service.js
├── repositories/
│   ├── catalog.repository.js      # Data access layer
│   ├── permission.repository.js
│   └── system-config.repository.js
├── routes/
│   ├── config.route.js            # Route definitions
│   └── system.route.js
├── validators/
│   ├── config.validator.js        # Input validation
│   └── system.validator.js
├── docs/
│   ├── config.docs.js             # Swagger documentation
│   └── system.docs.js
└── middlewares/
    ├── auth.middleware.js         # Authentication & authorization
    ├── error.middleware.js        # Error handling
    └── validate.middleware.js     # Validation middleware
```

---

## 🚀 Best Practices

### 1. Always Use Transactions

For bulk operations (permissions update, catalog reordering):

```javascript
await client.query("BEGIN");
// ... operations
await client.query("COMMIT");
```

### 2. Soft Deletes

Never hard delete catalog items - use `is_active = false`:

```sql
UPDATE config_catalog SET is_active = FALSE WHERE id = $1
```

### 3. Case-Insensitive Checks

Duplicate checks should be case-insensitive:

```sql
WHERE LOWER(value) = LOWER($1)
```

### 4. Proper Error Classes

Use custom error classes for proper HTTP status codes:

```javascript
throw new ValidationError("Value is required"); // 400
throw new NotFoundError("Item not found"); // 404
throw new ConflictError("Already exists"); // 409
```

### 5. Input Sanitization

Always trim and validate user input:

```javascript
const trimmedValue = value.trim();
if (!trimmedValue) throw new ValidationError("Value is required");
```

---

## 📖 Additional Resources

- **Swagger UI**: `/api-docs` (when running locally)
- **Database Schema**: `backend/script.sql`
- **Context Design**: `docs/context_design.md`
- **Test Helpers**: `backend/src/__tests__/helpers/`

---

## 🔄 Version History

- **v1.0.0** (2026-01-13): Initial implementation
  - Catalog management (CRUD)
  - Permission management (matrix-based)
  - System configuration
  - Complete test coverage (95 tests)
