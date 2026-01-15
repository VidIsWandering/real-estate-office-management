# Migration Checklist for Merging feature/setting to develop

## Overview

Khi merge nhánh `feature/setting` vào `develop`, cần apply 8 migration files để database Neon có đủ tables và columns cho code mới.

## Schema Differences Summary

### Develop Branch (Thiếu)

- ❌ `login_session` table
- ❌ `system_config` table
- ❌ `config_catalog` table
- ❌ `role_permission` table
- ❌ `staff_position_enum` không có 'admin'
- ❌ `staff` table thiếu: `created_at`, `updated_at`, `preferences`
- ❌ `account` table thiếu: `updated_at`
- ❌ Passwords = password123 (fails validation)

### Feature/Setting Branch (Đầy đủ)

- ✅ Tất cả tables và columns cần thiết
- ✅ Passwords = Password123 (meets validation)
- ✅ RBAC permissions configured
- ✅ Sample data for all configs

## Migration Files (Apply in Order)

### 001_add_login_session.sql

**Mục đích:** Tạo table tracking active sessions  
**Sử dụng bởi:** Security Tab (Active Sessions, Login History)

```sql
-- Creates login_session table
-- Indexes: account_id, token_hash, expires_at, is_active
```

### 002_update_passwords.sql

**Mục đích:** Update passwords từ password123 → Password123  
**Sử dụng bởi:** Login, Security Tab (Change Password)

```sql
-- Updates all seed accounts
-- New hash: $2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC
```

### 003_add_system_config_table.sql

**Mục đích:** Tạo table lưu system-wide config (JSONB)  
**Sử dụng bởi:** Office Tab, Notifications Tab

```sql
-- Creates system_config table
-- Default data: company_info, notification_settings
```

### 004_add_config_catalog_table.sql

**Mục đích:** Tạo table cho configurable catalogs  
**Sử dụng bởi:** Dropdown options cho properties, areas, sources

```sql
-- Creates config_catalog table + catalog_type_enum
-- Sample data: property types, areas, lead sources, contract types
```

### 005_add_role_permission_table.sql

**Mục đích:** Tạo RBAC permission matrix  
**Sử dụng bởi:** Config Tab (Permissions management)

```sql
-- Creates role_permission table + resource_enum + permission_enum
-- Default permissions for all 5 roles: admin, manager, agent, legal_officer, accountant
-- 6 resources × 4 permissions × 5 roles = 120 permission records
```

### 006_update_staff_table.sql

**Mục đích:** Thêm columns cho staff table  
**Sử dụng bởi:** Account Tab, Staff management

```sql
-- Adds: created_at, updated_at, preferences (JSONB)
```

### 007_add_admin_position.sql

**Mục đích:** Thêm 'admin' position vào enum + tạo admin account  
**Sử dụng bởi:** Full system access, Settings management

```sql
-- Adds 'admin' to staff_position_enum
-- Creates admin account and staff record
-- Password: Password123
```

### 008_add_account_updated_at.sql

**Mục đích:** Thêm updated_at column + auto-update trigger  
**Sử dụng bởi:** Account Tab (track profile changes)

```sql
-- Adds account.updated_at
-- Creates trigger for auto-update
```

## Deployment Steps for Neon

### Step 1: Backup Current Database

```bash
# Export current schema
pg_dump "postgresql://user:pass@host/db?sslmode=require" > backup_$(date +%Y%m%d).sql
```

### Step 2: Connect to Neon

```bash
psql "postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Step 3: Apply Migrations (Interactive)

```sql
-- Run each migration and verify
\i backend/migrations/001_add_login_session.sql
SELECT COUNT(*) FROM login_session; -- Should return 0

\i backend/migrations/002_update_passwords.sql
SELECT username FROM account WHERE password LIKE '$2a$10$71VDs%'; -- Should show 4-5 accounts

\i backend/migrations/003_add_system_config_table.sql
SELECT key FROM system_config; -- Should return company_info, notification_settings

\i backend/migrations/004_add_config_catalog_table.sql
SELECT type, COUNT(*) FROM config_catalog GROUP BY type; -- Should show 4 types

\i backend/migrations/005_add_role_permission_table.sql
SELECT position, COUNT(*) FROM role_permission GROUP BY position; -- 24 permissions per role

\i backend/migrations/006_update_staff_table.sql
\d staff -- Should show created_at, updated_at, preferences

\i backend/migrations/007_add_admin_position.sql
SELECT unnest(enum_range(NULL::staff_position_enum)); -- Should include 'admin'

\i backend/migrations/008_add_account_updated_at.sql
\d account -- Should show updated_at column
```

### Step 4: Automated Script (Recommended)

```bash
#!/bin/bash
# deploy-migrations.sh

DB_URL="postgresql://user:pass@host/db?sslmode=require"

echo "Starting migration deployment to Neon..."

migrations=(
  "001_add_login_session.sql"
  "002_update_passwords.sql"
  "003_add_system_config_table.sql"
  "004_add_config_catalog_table.sql"
  "005_add_role_permission_table.sql"
  "006_update_staff_table.sql"
  "007_add_admin_position.sql"
  "008_add_account_updated_at.sql"
)

for migration in "${migrations[@]}"; do
  echo "Applying $migration..."
  psql "$DB_URL" -f "backend/migrations/$migration"

  if [ $? -ne 0 ]; then
    echo "ERROR: Failed to apply $migration"
    exit 1
  fi
done

echo "All migrations applied successfully!"

# Run verification
echo "Running verification..."
psql "$DB_URL" -c "
  SELECT 'Tables created:' as check;
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('login_session', 'system_config', 'config_catalog', 'role_permission');

  SELECT 'Admin position exists:' as check;
  SELECT unnest(enum_range(NULL::staff_position_enum)) WHERE unnest::text = 'admin';

  SELECT 'Password updated:' as check;
  SELECT COUNT(*) as updated_accounts FROM account
  WHERE password = '\$2a\$10\$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC';
"
```

### Step 5: Verify Deployment

```sql
-- Check all critical tables exist
SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'login_session')
    THEN '✅' ELSE '❌'
  END as login_session,
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'system_config')
    THEN '✅' ELSE '❌'
  END as system_config,
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'config_catalog')
    THEN '✅' ELSE '❌'
  END as config_catalog,
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'role_permission')
    THEN '✅' ELSE '❌'
  END as role_permission;

-- Check staff table columns
SELECT
  column_name, data_type
FROM information_schema.columns
WHERE table_name = 'staff'
  AND column_name IN ('created_at', 'updated_at', 'preferences')
ORDER BY column_name;

-- Check account.updated_at
SELECT
  column_name, data_type
FROM information_schema.columns
WHERE table_name = 'account'
  AND column_name = 'updated_at';

-- Check admin position
SELECT
  CASE
    WHEN 'admin'::text = ANY(enum_range(NULL::staff_position_enum)::text[])
    THEN '✅ Admin position exists'
    ELSE '❌ Admin position missing'
  END as admin_check;

-- Check role permissions count
SELECT
  position,
  COUNT(*) as permission_count,
  CASE
    WHEN COUNT(*) = 24 THEN '✅'
    ELSE '⚠️ Should be 24'
  END as status
FROM role_permission
GROUP BY position
ORDER BY position;
```

## Code Dependencies

### Backend Files Using New Tables:

**system_config table:**

- [src/repositories/system-config.repository.js](../backend/src/repositories/system-config.repository.js)
- [src/controllers/system.controller.js](../backend/src/controllers/system.controller.js)
- Office Tab, Notifications Tab

**config_catalog table:**

- [src/repositories/catalog.repository.js](../backend/src/repositories/catalog.repository.js)
- [src/controllers/catalog.controller.js](../backend/src/controllers/catalog.controller.js)

**role_permission table:**

- [src/repositories/permission.repository.js](../backend/src/repositories/permission.repository.js)
- [src/controllers/permission.controller.js](../backend/src/controllers/permission.controller.js)
- Config Tab (Permissions)

**login_session table:**

- [src/repositories/security.repository.js](../backend/src/repositories/security.repository.js)
- [src/controllers/security.controller.js](../backend/src/controllers/security.controller.js)
- Security Tab

**account.updated_at:**

- [src/controllers/auth.controller.js](../backend/src/controllers/auth.controller.js) - Profile update
- Account Tab

**staff fields (created_at, updated_at, preferences):**

- [src/controllers/auth.controller.js](../backend/src/controllers/auth.controller.js) - getProfile
- Account Tab

## Testing After Deployment

1. **Login Test:**

   - Username: admin
   - Password: Password123
   - Should successfully authenticate

2. **Settings Page Tests:**

   - ✅ Account Tab: View/edit profile
   - ✅ Security Tab: Change password, view sessions, login history
   - ✅ Notifications Tab: Toggle preferences
   - ✅ Office Tab: View/edit company info
   - ✅ Config Tab: View/edit permissions

3. **API Tests:**

```bash
# Get profile
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/v1/auth/profile

# Get system config
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/v1/system/config

# Get permissions
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/v1/system/permissions/agent
```

## Rollback Plan

If deployment fails:

```sql
-- Rollback script (reverse order)
DROP TRIGGER IF EXISTS trigger_account_updated_at ON account;
DROP FUNCTION IF EXISTS update_account_updated_at();
ALTER TABLE account DROP COLUMN IF EXISTS updated_at;

-- Cannot remove enum value (PostgreSQL limitation)
-- Would need to recreate enum if needed

ALTER TABLE staff DROP COLUMN IF EXISTS preferences;
ALTER TABLE staff DROP COLUMN IF EXISTS updated_at;
ALTER TABLE staff DROP COLUMN IF EXISTS created_at;

DROP TABLE IF EXISTS role_permission CASCADE;
DROP TYPE IF EXISTS resource_enum;
DROP TYPE IF EXISTS permission_enum;

DROP TABLE IF EXISTS config_catalog CASCADE;
DROP TYPE IF EXISTS catalog_type_enum;

DROP TABLE IF EXISTS system_config CASCADE;

-- Reset passwords (optional)
UPDATE account SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQlTBSM0QKS9RGkXfPe0HhI0xVQy';

DROP TABLE IF EXISTS login_session CASCADE;
```

## Important Notes

1. **Idempotent Migrations:** All migrations use `IF NOT EXISTS` / `ON CONFLICT DO NOTHING`, safe to run multiple times

2. **Enum Limitation:** Cannot remove values from PostgreSQL enums. Adding 'admin' is one-way operation.

3. **Data Preservation:** All migrations preserve existing data. Only additions, no deletions.

4. **Foreign Keys:** All foreign keys use appropriate ON DELETE actions (CASCADE, SET NULL, RESTRICT)

5. **Indexes:** All tables have proper indexes for query performance

6. **Sample Data:** Migrations include sensible defaults for immediate functionality

## Next Steps After Migration

1. Update environment variables if needed
2. Restart backend service to connect to updated database
3. Test all Settings tabs functionality
4. Monitor application logs for any database-related errors
5. Update documentation if schema changes

## Support

For issues during migration:

1. Check [backend/migrations/README.md](../backend/migrations/README.md)
2. Review [docs/SETTINGS_IMPLEMENTATION.md](./SETTINGS_IMPLEMENTATION.md)
3. Check Neon dashboard for connection issues
4. Verify all migration files are present in repository
