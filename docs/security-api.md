# Security Features API Documentation

## Overview

Backend đã triển khai đầy đủ Security Tab features cho Settings Page, bao gồm:

- Session Management (Quản lý phiên đăng nhập)
- Login History (Lịch sử đăng nhập)
- Two-Factor Authentication (2FA) - placeholder

## Database Schema

### login_session Table

Lưu trữ thông tin về các phiên đăng nhập đang hoạt động.

```sql
CREATE TABLE login_session (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,    -- SHA256 hash of refresh token
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_info JSONB,                   -- Browser, OS, device type
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_login_session_account ON login_session(account_id);
CREATE INDEX idx_login_session_token ON login_session(token_hash);
CREATE INDEX idx_login_session_active ON login_session(is_active, expires_at);
```

### audit_log Table Updates

Thêm các cột để tracking login activity:

```sql
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'success';

CREATE INDEX idx_audit_log_action_created ON audit_log(action_type, created_at DESC);
```

## API Endpoints

### 1. Upload Avatar

**Endpoint:** `POST /api/v1/auth/profile/avatar`

**Description:** Upload avatar image cho user profile

**Authentication:** Required (Bearer Token)

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `avatar`: Image file (JPEG, PNG, GIF, WebP)
  - Max size: 5MB

**Response (200):**

```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "/uploads/avatars/1-1768320171558.jpg",
    "staff": {
      "id": 1,
      "full_name": "Admin User",
      "avatar": "/uploads/avatars/1-1768320171558.jpg",
      ...
    }
  }
}
```

**Error Responses:**

- `400`: No file uploaded or invalid file type
- `413`: File too large (>5MB)

---

### 2. Get Active Sessions

**Endpoint:** `GET /api/v1/auth/sessions`

**Description:** Lấy danh sách tất cả phiên đăng nhập đang hoạt động

**Authentication:** Required (Bearer Token)

**Response (200):**

```json
{
  "success": true,
  "message": "Sessions retrieved successfully",
  "data": [
    {
      "id": 1,
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "device_info": {
        "browser": "Chrome",
        "os": "Windows 10",
        "device": "Desktop"
      },
      "last_activity": "2026-01-13T16:30:00Z",
      "expires_at": "2026-01-20T16:30:00Z",
      "is_current": true,
      "created_at": "2026-01-13T16:00:00Z"
    },
    {
      "id": 2,
      "ip_address": "192.168.1.101",
      "user_agent": "Mobile Safari...",
      "device_info": {
        "browser": "Safari",
        "os": "iOS 16",
        "device": "Mobile"
      },
      "last_activity": "2026-01-13T15:00:00Z",
      "expires_at": "2026-01-20T15:00:00Z",
      "is_current": false,
      "created_at": "2026-01-13T10:00:00Z"
    }
  ]
}
```

**Notes:**

- `is_current`: True nếu session này đang được sử dụng (last_activity < 15 phút)
- Sessions tự động expire sau 7 ngày không hoạt động

---

### 3. Revoke Session

**Endpoint:** `DELETE /api/v1/auth/sessions/:id`

**Description:** Đăng xuất khỏi một phiên đăng nhập cụ thể

**Authentication:** Required (Bearer Token)

**Parameters:**

- `id` (path): Session ID cần revoke

**Response (200):**

```json
{
  "success": true,
  "message": "Session revoked successfully",
  "data": {
    "revoked": true
  }
}
```

**Error Responses:**

- `404`: Session not found
- `403`: Not authorized to revoke this session

---

### 4. Revoke All Sessions

**Endpoint:** `POST /api/v1/auth/sessions/revoke-all`

**Description:** Đăng xuất khỏi tất cả phiên đăng nhập khác (giữ lại phiên hiện tại)

**Authentication:** Required (Bearer Token)

**Request Body (optional):**

```json
{
  "current_session_id": 1
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "All sessions revoked successfully",
  "data": {
    "revoked_count": 3
  }
}
```

**Use Case:**

- User nghi ngờ tài khoản bị compromise
- Đăng xuất khỏi tất cả thiết bị khác

---

### 5. Get Login History

**Endpoint:** `GET /api/v1/auth/login-history`

**Description:** Lấy lịch sử đăng nhập/đăng xuất

**Authentication:** Required (Bearer Token)

**Query Parameters:**

- `limit` (optional): Số lượng bản ghi (1-100, default: 50)

**Response (200):**

```json
{
  "success": true,
  "message": "Login history retrieved successfully",
  "data": [
    {
      "id": 123,
      "action_type": "LOGIN",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "status": "success",
      "created_at": "2026-01-13T16:00:00Z"
    },
    {
      "id": 122,
      "action_type": "LOGIN_FAILED",
      "ip_address": "192.168.1.200",
      "user_agent": "curl/7.68.0",
      "status": "failed",
      "created_at": "2026-01-13T15:30:00Z"
    },
    {
      "id": 121,
      "action_type": "LOGOUT",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "status": "success",
      "created_at": "2026-01-13T10:00:00Z"
    }
  ]
}
```

**Action Types:**

- `LOGIN`: Successful login
- `LOGOUT`: User logout
- `LOGIN_FAILED`: Failed login attempt

**Use Case:**

- Security audit
- Detect suspicious login attempts
- Track device access history

---

### 6. Enable 2FA (Placeholder)

**Endpoint:** `POST /api/v1/auth/2fa/enable`

**Description:** Enable two-factor authentication (chưa implement đầy đủ)

**Authentication:** Required (Bearer Token)

**Response (501):**

```json
{
  "success": false,
  "message": "2FA feature not yet implemented - requires OTP library (speakeasy or otplib)"
}
```

**TODO:**

- Install OTP library (speakeasy hoặc otplib)
- Tạo secret key cho mỗi user
- Generate QR code
- Verify setup token
- Implement backup codes

---

### 7. Disable 2FA (Placeholder)

**Endpoint:** `POST /api/v1/auth/2fa/disable`

**Description:** Disable two-factor authentication (chưa implement đầy đủ)

**Authentication:** Required (Bearer Token)

**Response (501):**

```json
{
  "success": false,
  "message": "2FA feature not yet implemented - requires OTP library (speakeasy or otplib)"
}
```

---

### 8. Verify 2FA Token (Placeholder)

**Endpoint:** `POST /api/v1/auth/2fa/verify`

**Description:** Verify 2FA token (chưa implement đầy đủ)

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "token": "123456"
}
```

**Response (501):**

```json
{
  "success": false,
  "message": "2FA feature not yet implemented - requires OTP library (speakeasy or otplib)"
}
```

---

## Security Considerations

### Token Hashing

Refresh tokens được hash bằng SHA256 trước khi lưu vào database để bảo mật:

```javascript
const crypto = require("crypto");
const tokenHash = crypto
  .createHash("sha256")
  .update(refreshToken)
  .digest("hex");
```

### Session Expiration

- Sessions tự động expire sau 7 ngày không hoạt động
- `expires_at` được set khi tạo session
- Có thể cleanup expired sessions bằng `cleanupExpiredSessions()` method

### Activity Tracking

- `last_activity` được update mỗi khi user gọi API
- Sessions với `last_activity` < 15 phút được đánh dấu là "current"

### IP & User Agent Tracking

- Lưu IP address và User Agent của mỗi request
- Giúp detect suspicious activity (login từ địa điểm lạ)

---

## Implementation Files

### Created Files

1. **Backend:**

   - `src/controllers/security.controller.js` - HTTP handlers
   - `src/services/security.service.js` - Business logic
   - `src/repositories/security.repository.js` - Database operations
   - `src/validators/security.validator.js` - Request validation
   - `src/middlewares/upload.middleware.js` - File upload handling
   - `migrations/add_security_features.sql` - Database migration

2. **Documentation:**
   - `docs/security-api.md` - This file
   - Swagger docs in `src/docs/auth.docs.js`

### Modified Files

1. **Backend:**
   - `src/routes/auth.route.js` - Added security routes
   - `src/services/auth.service.js` - Added uploadAvatar method
   - `src/controllers/auth.controller.js` - Added uploadAvatar handler
   - `.gitignore` - Ignore uploaded files

### Directory Structure

```
backend/
├── migrations/
│   └── add_security_features.sql
├── src/
│   ├── controllers/
│   │   └── security.controller.js
│   ├── services/
│   │   └── security.service.js
│   ├── repositories/
│   │   └── security.repository.js
│   ├── validators/
│   │   └── security.validator.js
│   ├── middlewares/
│   │   └── upload.middleware.js
│   └── docs/
│       └── auth.docs.js (updated)
└── uploads/
    └── avatars/
        └── .gitkeep
```

---

## Testing

All existing tests still passing: **95 tests passed**

### Integration Tests Needed

Create `src/__tests__/integration/security.api.test.js`:

```javascript
describe("Security API Integration Tests", () => {
  describe("GET /auth/sessions", () => {
    it("should get all active sessions");
    it("should mark current session");
    it("should require authentication");
  });

  describe("DELETE /auth/sessions/:id", () => {
    it("should revoke specific session");
    it("should return 404 for non-existent session");
    it("should not allow revoking other user sessions");
  });

  describe("POST /auth/sessions/revoke-all", () => {
    it("should revoke all sessions except current");
    it("should return revoked count");
  });

  describe("GET /auth/login-history", () => {
    it("should get login history");
    it("should respect limit parameter");
    it("should reject limit > 100");
  });

  describe("POST /auth/profile/avatar", () => {
    it("should upload avatar successfully");
    it("should reject non-image files");
    it("should reject files > 5MB");
    it("should update staff.avatar");
  });
});
```

---

## Future Enhancements

### 2FA Implementation

**Required Steps:**

1. **Install OTP Library:**

   ```bash
   npm install speakeasy qrcode
   ```

2. **Database Changes:**

   ```sql
   ALTER TABLE account ADD COLUMN two_factor_secret VARCHAR(255);
   ALTER TABLE account ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
   CREATE TABLE backup_codes (
     id SERIAL PRIMARY KEY,
     account_id INTEGER REFERENCES account(id),
     code VARCHAR(20),
     used BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Implementation:**

   - Generate secret: `speakeasy.generateSecret()`
   - Generate QR code: `qrcode.toDataURL(otpauth_url)`
   - Verify token: `speakeasy.totp.verify()`
   - Generate backup codes: Random strings

4. **Flow:**
   - User enables 2FA → Generate secret + QR code
   - User scans QR with authenticator app
   - User verifies token to confirm setup
   - Generate 10 backup codes
   - On login, verify 2FA token before issuing JWT

### Device Fingerprinting

- Collect more device info (screen resolution, timezone, etc.)
- Detect suspicious devices
- Require re-authentication for new devices

### Geolocation Tracking

- Use IP geolocation API (ipapi.co, ipinfo.io)
- Alert user on login from new country
- Block suspicious locations

---

## Deployment Checklist

- [x] Database migration executed
- [x] Tests passing (95/95)
- [x] Swagger documentation added
- [x] Upload directory created
- [x] .gitignore updated
- [ ] Integration tests for security endpoints
- [ ] Test avatar upload with real files
- [ ] Review security repository methods
- [ ] Decide on 2FA library (speakeasy vs otplib)

---

## Support

For questions or issues, contact the development team.
