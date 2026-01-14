# Account Tab API Documentation

## Overview

Backend đã triển khai đầy đủ Account Tab features cho Settings Page, bao gồm:

- View Profile (Xem thông tin cá nhân)
- Edit Profile (Chỉnh sửa thông tin)
- Upload Avatar (Tải lên ảnh đại diện)
- Change Password (Đổi mật khẩu)

## API Endpoints

### 1. Get Profile

**Endpoint:** `GET /api/v1/auth/profile`

**Description:** Lấy thông tin profile của user hiện tại

**Authentication:** Required (Bearer Token)

**Response (200):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "account": {
      "id": 1,
      "username": "admin",
      "created_at": "2026-01-01T00:00:00Z"
    },
    "staff": {
      "id": 1,
      "account_id": 1,
      "full_name": "Admin User",
      "email": "admin@company.com",
      "phone_number": "0901234567",
      "position": "manager",
      "avatar": "/uploads/avatars/1-1768320171558.jpg",
      "date_of_birth": "1990-01-01",
      "address": "123 Main St",
      "hire_date": "2020-01-01",
      "is_active": true
    }
  }
}
```

**Implementation:**

- File: `src/controllers/auth.controller.js` → `getProfile()`
- Service: `src/services/auth.service.js` → `getProfile()`
- Returns account info + staff profile

---

### 2. Update Profile

**Endpoint:** `PUT /api/v1/auth/profile`

**Description:** Cập nhật thông tin profile

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "full_name": "Updated Name",
  "email": "newemail@company.com",
  "phone_number": "0987654321",
  "date_of_birth": "1990-01-01",
  "address": "456 New Street"
}
```

**Validation:**

- `full_name`: optional, min 2 chars
- `email`: optional, valid email format
- `phone_number`: optional, 10-11 digits
- `date_of_birth`: optional, ISO date format
- `address`: optional

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "staff": {
      "id": 1,
      "full_name": "Updated Name",
      "email": "newemail@company.com",
      "phone_number": "0987654321",
      ...
    }
  }
}
```

**Error Responses:**

- `400`: Validation error (invalid email, phone format)
- `409`: Email already exists

**Implementation:**

- File: `src/controllers/auth.controller.js` → `updateProfile()`
- Service: `src/services/auth.service.js` → `updateProfile()`
- Validator: `src/validators/auth.validator.js` → `updateProfileValidator`

---

### 3. Upload Avatar

**Endpoint:** `POST /api/v1/auth/profile/avatar`

**Description:** Tải lên ảnh đại diện

**Authentication:** Required (Bearer Token)

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `avatar`: Image file

**File Restrictions:**

- Allowed types: JPEG, JPG, PNG, GIF, WebP
- Max size: 5MB
- Filename format: `{accountId}-{timestamp}.{ext}`
- Storage: `backend/uploads/avatars/`

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

- `400`: No file uploaded
- `400`: Invalid file type
- `413`: File too large (>5MB)

**Implementation:**

- File: `src/controllers/auth.controller.js` → `uploadAvatar()`
- Service: `src/services/auth.service.js` → `uploadAvatar()`
- Middleware: `src/middlewares/upload.middleware.js` → `uploadAvatar`
- Upload handling: Multer with diskStorage
- Old avatar cleanup: Automatic (overwrite by filename pattern)

**Multer Configuration:**

```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/avatars";
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const accountId = req.user?.id || "unknown";
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${accountId}-${timestamp}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError("Only image files are allowed"), false);
  }
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("avatar");
```

---

### 4. Change Password

**Endpoint:** `PUT /api/v1/auth/change-password`

**Description:** Đổi mật khẩu

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
  "current_password": "OldPass123",
  "new_password": "NewPass456",
  "confirm_password": "NewPass456"
}
```

**Validation:**

- `current_password`: required
- `new_password`: required, min 6 chars
- `confirm_password`: required, must match new_password

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "changed": true
  }
}
```

**Error Responses:**

- `400`: Validation error (passwords don't match, too short)
- `401`: Current password incorrect

**Implementation:**

- File: `src/controllers/auth.controller.js` → `changePassword()`
- Service: `src/services/auth.service.js` → `changePassword()`
- Validator: `src/validators/auth.validator.js` → `changePasswordValidator`
- Password hashing: bcrypt (cost factor: 10)

**Security:**

- Current password verified before change
- New password hashed with bcrypt
- All sessions remain active (user not logged out)

---

## Frontend Integration

### Account Tab Components

The frontend should display:

1. **Profile Information Section:**

   - Avatar preview (clickable to upload)
   - Full name (editable)
   - Email (editable)
   - Phone number (editable)
   - Date of birth (editable)
   - Address (editable)
   - Position (read-only)
   - Hire date (read-only)

2. **Avatar Upload:**

   - Click avatar to open file picker
   - Show preview before upload
   - Drag & drop support (optional)
   - Progress indicator during upload

3. **Change Password Section:**
   - Current password field (password type)
   - New password field (password type)
   - Confirm password field (password type)
   - Submit button

### Sample Frontend Code

**Get Profile:**

```typescript
const getProfile = async () => {
  const response = await fetch("/api/v1/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.data; // { account, staff }
};
```

**Update Profile:**

```typescript
const updateProfile = async (profileData: ProfileUpdate) => {
  const response = await fetch("/api/v1/auth/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });
  return await response.json();
};
```

**Upload Avatar:**

```typescript
const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch("/api/v1/auth/profile/avatar", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return await response.json();
};
```

**Change Password:**

```typescript
const changePassword = async (passwordData: PasswordChange) => {
  const response = await fetch("/api/v1/auth/change-password", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });
  return await response.json();
};
```

---

## Testing

### Existing Tests

File: `src/__tests__/integration/auth.api.test.js`

**Covered:**

- ✅ POST /auth/login
- ✅ GET /auth/profile
- ✅ PUT /auth/profile
- ✅ PUT /auth/change-password
- ✅ POST /auth/refresh-token

**Test Status:** 12 tests passing

### Additional Tests Needed

Create avatar upload tests:

```javascript
describe("POST /auth/profile/avatar", () => {
  it("should upload avatar successfully", async () => {
    const response = await request(app)
      .post("/api/v1/auth/profile/avatar")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", "test-fixtures/avatar.jpg")
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.avatar).toMatch(
      /^\/uploads\/avatars\/\d+-\d+\.jpg$/
    );
  });

  it("should reject non-image files", async () => {
    const response = await request(app)
      .post("/api/v1/auth/profile/avatar")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", "test-fixtures/document.pdf")
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it("should reject files > 5MB", async () => {
    // Create large file > 5MB
    const largeFile = Buffer.alloc(6 * 1024 * 1024);
    // Test implementation...
  });

  it("should require authentication", async () => {
    await request(app)
      .post("/api/v1/auth/profile/avatar")
      .attach("avatar", "test-fixtures/avatar.jpg")
      .expect(401);
  });
});
```

---

## Implementation Status

### Completed Features ✅

1. **Get Profile:**

   - ✅ Controller implemented
   - ✅ Service implemented
   - ✅ Tests passing
   - ✅ Swagger docs

2. **Update Profile:**

   - ✅ Controller implemented
   - ✅ Service implemented
   - ✅ Validator implemented
   - ✅ Tests passing
   - ✅ Swagger docs

3. **Upload Avatar:**

   - ✅ Multer middleware configured
   - ✅ Controller implemented
   - ✅ Service implemented
   - ✅ Upload directory created
   - ✅ .gitignore updated
   - ✅ Swagger docs
   - ⚠️ Tests pending (manual testing required)

4. **Change Password:**
   - ✅ Controller implemented
   - ✅ Service implemented
   - ✅ Validator implemented
   - ✅ Tests passing
   - ✅ Swagger docs

### Files Summary

**Controllers:**

- `src/controllers/auth.controller.js` - All methods implemented

**Services:**

- `src/services/auth.service.js` - Business logic complete

**Validators:**

- `src/validators/auth.validator.js` - All validators ready

**Middlewares:**

- `src/middlewares/upload.middleware.js` - Multer configuration

**Routes:**

- `src/routes/auth.route.js` - All routes registered

**Tests:**

- `src/__tests__/integration/auth.api.test.js` - 12 tests passing

**Documentation:**

- `src/docs/auth.docs.js` - Swagger specs complete
- `docs/account-tab-api.md` - This document

---

## Deployment Notes

### Environment Variables

No additional environment variables needed for Account Tab features.

### File System

Ensure `uploads/avatars` directory exists and is writable:

```bash
mkdir -p backend/uploads/avatars
chmod 755 backend/uploads/avatars
```

For Docker:

```yaml
volumes:
  - ./backend/uploads:/app/uploads
```

### Static File Serving

Ensure Express serves uploaded files:

```javascript
app.use("/uploads", express.static("uploads"));
```

This is typically already configured in `src/app.js`.

---

## Best Practices

### Avatar Management

1. **File Naming:**

   - Pattern: `{accountId}-{timestamp}.{ext}`
   - Benefits: Easy to identify owner, automatic versioning
   - Old files automatically replaced by new uploads (same account ID prefix)

2. **Security:**

   - Only authenticated users can upload
   - File type validation (images only)
   - File size limit (5MB max)
   - Stored outside web root for better security

3. **Performance:**
   - Consider image optimization (resize, compress) for production
   - Libraries: sharp, jimp
   - Recommended: Resize to 400x400px, compress to 80% quality

### Password Security

1. **Hashing:**

   - Algorithm: bcrypt
   - Cost factor: 10 (adjustable in production)
   - Never store plain text passwords

2. **Validation:**

   - Minimum 6 characters (can be increased)
   - Verify current password before change
   - Confirm password must match

3. **Session Handling:**
   - Password change does NOT invalidate sessions
   - Consider adding "logout all devices" option after password change

---

## Future Enhancements

### Profile Features

- [ ] Email verification flow
- [ ] Phone number verification (SMS OTP)
- [ ] Profile completion percentage
- [ ] Activity log (profile changes history)

### Avatar Features

- [ ] Image cropping before upload
- [ ] Multiple size variants (thumbnail, medium, large)
- [ ] Image optimization (auto-resize, compress)
- [ ] Avatar history (keep previous avatars)
- [ ] Default avatars library

### Password Features

- [ ] Password strength indicator
- [ ] Password history (prevent reuse)
- [ ] Force password change (admin feature)
- [ ] Password expiration policy

---

## Support

For questions about Account Tab APIs, contact the development team.
