# Database Schema Management Strategy

## Overview

Project này sử dụng **2 approaches** khác nhau cho database schema management:

1. **`script.sql`** - Complete schema cho local development
2. **`migrations/`** - Incremental updates cho production

## Why Two Approaches?

### Use Case 1: Local Development (Fresh Database)

**Scenario:** Dev clone repo, chạy `docker-compose up -d`

**Challenge:** Cần database với complete schema ngay lập tức

**Solution:** `script.sql`

- Complete schema trong 1 file
- PostgreSQL `docker-entrypoint-initdb.d` tự động chạy
- Zero manual steps
- Reset dễ dàng: `down -v` → `up -d`

### Use Case 2: Production Deployment (Existing Database)

**Scenario:** Merge feature/setting vào develop, deploy lên Neon

**Challenge:** Database production đang chạy, có data, không thể drop/recreate

**Solution:** `migrations/`

- Incremental updates
- Preserves existing data
- Can be tracked (migrations table)
- Rollback strategy

## File Comparison

### script.sql (Local Dev)

```sql
-- Complete schema in one file
CREATE TABLE account (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- ✅ Already included
);

CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(50) NOT NULL,
    -- ... other columns ...
    preferences JSONB DEFAULT '{}',           -- ✅ Already included
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- ✅ Already included
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- ✅ Already included
);

-- ✅ All Settings tables already in script.sql
CREATE TABLE login_session (...);
CREATE TABLE system_config (...);
CREATE TABLE config_catalog (...);
CREATE TABLE role_permission (...);

-- ✅ All sample data included
INSERT INTO system_config (key, value, description) VALUES (...);
INSERT INTO config_catalog (type, value, display_order) VALUES (...);
INSERT INTO role_permission (position, resource, permission, is_granted) VALUES (...);
```

**Features:**

- ✅ Complete schema
- ✅ All ENUMs defined
- ✅ All indexes and constraints
- ✅ Sample data for immediate use
- ✅ Triggers (account.updated_at auto-update)
- ✅ 5 test accounts (admin, manager1, agent1, legal1, accountant1)
- ✅ All passwords: Password123

**Usage:**

```bash
# Automatic via Docker
docker-compose up -d

# Database được init tự động, không cần manual steps
```

### migrations/ (Production)

```
001_add_login_session.sql    - ADD login_session table
002_update_passwords.sql      - UPDATE passwords to Password123
003_add_system_config_table.sql - ADD system_config table + data
004_add_config_catalog_table.sql - ADD config_catalog table + data
005_add_role_permission_table.sql - ADD role_permission table + data
006_update_staff_table.sql    - ALTER staff ADD created_at, updated_at, preferences
007_add_admin_position.sql    - ALTER TYPE ADD VALUE 'admin'
008_add_account_updated_at.sql - ALTER account ADD updated_at + trigger
```

**Features:**

- ✅ Incremental changes only
- ✅ Idempotent (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`)
- ✅ Preserves existing data
- ✅ Can track execution (migrations table)
- ✅ Rollback scripts possible

**Usage:**

```bash
# Manual
psql "$NEON_URL" -f backend/migrations/001_add_login_session.sql
# ... continue with 002-008

# Or automated
node backend/scripts/run-migrations.js
```

## Schema Synchronization

### Current State (After Updates)

**`script.sql` now includes:**

- ✅ account.updated_at + trigger
- ✅ staff.created_at, updated_at, preferences
- ✅ staff_position_enum with 'admin'
- ✅ login_session table (was missing before!)
- ✅ system_config table with default data
- ✅ config_catalog table with sample data
- ✅ role_permission table with full permission matrix (120 records)
- ✅ All 5 seed accounts with Password123
- ✅ Admin + Manager permissions included

**Both environments now have identical schemas!**

### What Changed?

**Before this PR:**

```diff
script.sql (develop branch):
- ❌ No login_session table
- ❌ No system_config table
- ❌ No config_catalog table
- ❌ No role_permission table
- ❌ account missing updated_at
- ❌ staff missing created_at, updated_at, preferences
- ❌ staff_position_enum no 'admin'
- ❌ passwords: password123 (fails validation)
```

**After this PR:**

```diff
script.sql (feature/setting branch):
+ ✅ login_session table with indexes
+ ✅ system_config with company_info & notification_settings
+ ✅ config_catalog with property types, areas, sources
+ ✅ role_permission with 120 permission records (5 roles × 6 resources × 4 permissions)
+ ✅ account.updated_at with auto-update trigger
+ ✅ staff.created_at, updated_at, preferences (JSONB)
+ ✅ staff_position_enum includes 'admin'
+ ✅ All passwords updated to Password123
+ ✅ Admin permissions included in role_permission data
```

## Workflow by Environment

### Local Development Workflow

```bash
# 1. Clone repo
git clone <repo>
cd real-estate-office-management

# 2. Start Docker (database auto-inits with script.sql)
docker-compose up -d

# 3. Verify database
docker exec -it se100-db psql -U devuser -d se100_dev_db -c "\dt"

# Expected output: All 15+ tables including:
# - login_session
# - system_config
# - config_catalog
# - role_permission

# 4. Test login
# URL: http://localhost:3000
# User: admin
# Pass: Password123

# 5. Make code changes (hot reload automatic)

# 6. Need fresh database?
docker-compose down -v  # Delete volume
docker-compose up -d    # Recreate from script.sql
```

**Key Point:** Migrations folder is **ignored** in local dev!

### Production Deployment Workflow

```bash
# Context: Neon database already exists with develop branch schema
# Need to: Apply incremental changes from feature/setting

# 1. Backup current database
pg_dump "$NEON_URL" > backup_before_migration.sql

# 2. Apply migrations in order
psql "$NEON_URL" -f backend/migrations/001_add_login_session.sql
psql "$NEON_URL" -f backend/migrations/002_update_passwords.sql
psql "$NEON_URL" -f backend/migrations/003_add_system_config_table.sql
psql "$NEON_URL" -f backend/migrations/004_add_config_catalog_table.sql
psql "$NEON_URL" -f backend/migrations/005_add_role_permission_table.sql
psql "$NEON_URL" -f backend/migrations/006_update_staff_table.sql
psql "$NEON_URL" -f backend/migrations/007_add_admin_position.sql
psql "$NEON_URL" -f backend/migrations/008_add_account_updated_at.sql

# 3. Verify
psql "$NEON_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"

# 4. Test application
# - Login with admin / Password123
# - Check Settings page (all tabs should work)

# 5. Monitor for errors
tail -f /var/log/application.log
```

**Key Point:** `script.sql` is **ignored** in production (database already exists)!

## Migration Safety Features

All migrations use defensive SQL:

```sql
-- Tables
CREATE TABLE IF NOT EXISTS login_session (...);

-- Columns
ALTER TABLE staff ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_login_session_account ON login_session(account_id);

-- Data
INSERT INTO system_config (key, value) VALUES (...)
ON CONFLICT (key) DO NOTHING;

-- ENUMs (special handling)
ALTER TYPE staff_position_enum ADD VALUE IF NOT EXISTS 'admin' BEFORE 'manager';
```

**Benefits:**

- ✅ Idempotent (can run multiple times)
- ✅ No errors if already exists
- ✅ Safe for production
- ✅ Easy rollback

## Verification Checklist

### After Local Setup

```bash
# 1. Check all tables exist
docker exec -it se100-db psql -U devuser -d se100_dev_db -c "\dt" | grep -E "login_session|system_config|config_catalog|role_permission"

# Expected: All 4 tables listed

# 2. Check staff enum
docker exec -it se100-db psql -U devuser -d se100_dev_db -c "SELECT unnest(enum_range(NULL::staff_position_enum));"

# Expected: admin, manager, agent, legal_officer, accountant

# 3. Check account.updated_at
docker exec -it se100-db psql -U devuser -d se100_dev_db -c "\d account" | grep updated_at

# Expected: updated_at column exists

# 4. Check permission counts
docker exec -it se100-db psql -U devuser -d se100_dev_db -c "SELECT position, COUNT(*) FROM role_permission GROUP BY position ORDER BY position;"

# Expected:
#   admin        | 24
#   accountant   | 24
#   agent        | 24
#   legal_officer| 24
#   manager      | 24

# 5. Test login
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Password123"}'

# Expected: {success: true, token: "...", profile: {...}}
```

### After Production Migration

```sql
-- Run these queries on Neon

-- 1. Check all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('login_session', 'system_config', 'config_catalog', 'role_permission')
ORDER BY table_name;

-- Expected: 4 rows

-- 2. Check staff columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'staff'
  AND column_name IN ('created_at', 'updated_at', 'preferences')
ORDER BY column_name;

-- Expected: 3 rows

-- 3. Check account.updated_at
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'account'
  AND column_name = 'updated_at';

-- Expected: 1 row

-- 4. Check system_config data
SELECT key, jsonb_pretty(value)
FROM system_config;

-- Expected: company_info and notification_settings with JSON data

-- 5. Check permission matrix completeness
SELECT
  position,
  COUNT(*) as permission_count,
  SUM(CASE WHEN is_granted THEN 1 ELSE 0 END) as granted_count
FROM role_permission
GROUP BY position
ORDER BY position;

-- Expected: Each position has 24 permissions (6 resources × 4 permission types)
```

## Troubleshooting

### Issue: Migrations fail on Neon

**Symptom:** `ERROR: relation already exists`

**Cause:** Migrations applied before, or table already exists in develop schema

**Solution:**

```sql
-- Check which migrations already ran
SELECT * FROM migrations ORDER BY executed_at DESC;

-- Skip already applied migrations
-- Only run migrations that haven't been executed
```

### Issue: Local dev database missing tables

**Symptom:** App errors about missing `system_config` or `login_session`

**Cause:** Using old `script.sql` version

**Solution:**

```bash
# Pull latest script.sql
git pull origin feature/setting

# Reset database
docker-compose down -v
docker-compose up -d

# Verify
docker exec -it se100-db psql -U devuser -d se100_dev_db -c "\dt"
```

### Issue: Permission denied errors in app

**Symptom:** 403 errors, "insufficient permissions"

**Cause:** `role_permission` table missing or incomplete data

**Solution:**

```sql
-- Check permission counts
SELECT position, COUNT(*) FROM role_permission GROUP BY position;

-- Should show 24 for each position
-- If not, re-run 005_add_role_permission_table.sql
```

### Issue: Login fails with "incorrect password"

**Symptom:** Cannot login with Password123

**Cause:** Passwords not updated from password123

**Solution:**

```sql
-- Check current password hash
SELECT username, password FROM account WHERE username = 'admin';

-- Should be: $2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC

-- If not, update:
UPDATE account
SET password = '$2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC'
WHERE username IN ('admin', 'manager1', 'agent1', 'legal1', 'accountant1');
```

## Summary

| Aspect         | script.sql (Local)    | migrations/ (Production) |
| -------------- | --------------------- | ------------------------ |
| **Purpose**    | Complete schema       | Incremental updates      |
| **When**       | Fresh database        | Existing database        |
| **How**        | Docker auto-init      | Manual apply             |
| **Content**    | Everything            | Only changes             |
| **Idempotent** | N/A (drops/recreates) | Yes (IF NOT EXISTS)      |
| **Data**       | Sample data included  | Minimal seed data        |
| **Rollback**   | Reset container       | Reverse migrations       |
| **Tracking**   | Not needed            | migrations table         |
| **Use Case**   | Dev onboarding        | Production deploy        |

**Golden Rule:**

- Local dev → Use `script.sql` (complete)
- Production → Use `migrations/` (incremental)
- Never mix the two approaches!

## References

- [LOCAL_DEV_SETUP.md](../../LOCAL_DEV_SETUP.md) - Complete local development guide
- [backend/migrations/README.md](../backend/migrations/README.md) - Migration details
- [docs/MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) - Production deployment steps
- [docs/SETTINGS_IMPLEMENTATION.md](./SETTINGS_IMPLEMENTATION.md) - Settings page documentation
