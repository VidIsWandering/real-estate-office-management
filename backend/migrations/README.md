# Database Migrations Guide

## ⚠️ Important: When to Use Migrations

### Local Development: Use `script.sql` ✅

- **File:** `backend/script.sql` (complete schema)
- **Method:** Automatic via Docker Compose
- **When:** Every time you start fresh containers
- **Command:** `docker-compose up -d` (no manual steps!)
- **See:** [LOCAL_DEV_SETUP.md](../../LOCAL_DEV_SETUP.md) for details

### Production (Neon): Use Migrations ✅

- **Files:** `backend/migrations/001-008.sql` (incremental)
- **Method:** Manual apply or `run-migrations.js` script
- **When:** Deploying feature/setting branch to production
- **Purpose:** Update existing database without data loss

---

## Overview

This directory contains **incremental migrations** for production deployment (Neon database). These migrations update an **existing** database from develop branch schema to include Settings page features.

**DO NOT use these migrations for local development!** Local dev uses `script.sql` for complete schema initialization.

## Migration Files

### 001_add_login_session.sql

**Purpose:** Create login_session table for active sessions tracking  
**Dependencies:** Requires `account` table  
**Features:**

- Tracks active user sessions
- Stores token hash, IP address, user agent
- Supports device info in JSONB
- Includes expiration and activity tracking

### 002_update_passwords.sql

**Purpose:** Update seed passwords to meet validation requirements  
**Changes:**

- Old: `password123` (fails validation)
- New: `Password123` (6+ chars, uppercase, lowercase, number)
- Updates all seed accounts: admin, manager1, agent1, legal1, accountant1

### 003_add_system_config_table.sql

**Purpose:** Create system_config table for Office/Notifications settings  
**Features:**

- JSONB storage for nested configuration
- Stores company_info and notification_settings
- Tracks who last updated each config
- Used by: Office Tab, Notifications Tab

### 004_add_config_catalog_table.sql

**Purpose:** Create config_catalog table for configurable options  
**Features:**

- Property types, areas, lead sources, contract types
- Display ordering support
- Soft delete with is_active flag
- Sample data included

### 005_add_role_permission_table.sql

**Purpose:** Create role_permission table for RBAC (Role-Based Access Control)  
**Features:**

- Permission matrix for all staff positions (admin, manager, agent, legal_officer, accountant)
- Granular permissions: view, add, edit, delete
- Resources: transactions, contracts, payments, properties, partners, staff
- Default permissions for each role
- Used by: Config Tab (Permissions management)

### 006_update_staff_table.sql

**Purpose:** Add missing columns to staff table  
**Changes:**

- `created_at` - timestamp of record creation
- `updated_at` - timestamp of last update
- `preferences` - JSONB for staff preferences

### 007_add_admin_position.sql

**Purpose:** Add 'admin' position to staff_position_enum  
**Changes:**

- Adds 'admin' value to enum
- Creates admin account and staff record
- Password: Password123

### 008_add_account_updated_at.sql

**Purpose:** Add updated_at column to account table  
**Features:**

- Tracks last update time
- Auto-update trigger on record changes
- Used by: Account Tab (profile updates)

### add_security_features.sql

**Status:** ❌ **DELETED** - Legacy/duplicate file
**Reason:**

- Did not follow naming convention (no number prefix)
- Conflicted with 001_add_login_session.sql
- Had incorrect data types (INTEGER vs BIGINT)
- File has been removed from repository

---

## How to Apply Migrations

### For Local Development (Docker)

Migrations are applied automatically when the container starts:

```bash
docker-compose down -v  # Clear old data
docker-compose up -d    # Restart with fresh database
```

### For Neon Production Database

#### Option 1: Manual Application (Recommended for first deployment)

```bash
# Connect to Neon database
psql "postgresql://user:password@host/database?sslmode=require"

# Apply migrations in order
\i backend/migrations/001_add_login_session.sql
\i backend/migrations/002_update_passwords.sql
\i backend/migrations/003_add_system_config_table.sql
\i backend/migrations/004_add_config_catalog_table.sql
\i backend/migrations/005_add_role_permission_table.sql
\i backend/migrations/006_update_staff_table.sql
\i backend/migrations/007_add_admin_position.sql
\i backend/migrations/008_add_account_updated_at.sql
```

#### Option 2: Using Migration Script

```bash
# Set environment variable for Neon connection
export DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Run all migrations
for file in backend/migrations/{001..008}*.sql; do
  echo "Applying $file..."
  psql "$DATABASE_URL" -f "$file"
done
```

#### Option 3: Create Migration Runner (Future Enhancement)

Consider creating a Node.js migration runner:

```javascript
// backend/scripts/migrate.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const migrations = [
    '001_add_login_session.sql',
    '002_update_passwords.sql',
    '003_add_system_config_table.sql',
    '004_add_config_catalog_table.sql',
    '005_add_role_permission_table.sql',
    '006_update_staff_table.sql',
    '007_add_admin_position.sql',
    '008_add_account_updated_at.sql',
  ];

  for (const file of migrations) {
    console.log(`Applying ${file}...`);
    const sql = fs.readFileSync(
      path.join(__dirname, '../migrations', file),
      'utf8'
    );
    await pool.query(sql);
  }

  await pool.end();
  console.log('All migrations applied successfully!');
}

runMigrations().catch(console.error);
```

## Migration Dependencies

```
Base Schema (develop branch)
  ↓
001 - login_session table
  ↓
002 - update passwords to Password123
  ↓
003 - system_config table
  ↓
004 - config_catalog table (independent)
  ↓
005 - role_permission table (depends on staff_position_enum)
  ↓
006 - update staff table
  ↓
007 - add admin position (modifies enum, adds seed data)
  ↓
008 - add account.updated_at
```

## Verification Queries

After applying migrations, verify with these queries:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'login_session',
    'system_config',
    'config_catalog',
    'role_permission'
  );

-- Verify admin position exists
SELECT unnest(enum_range(NULL::staff_position_enum));

-- Check password updates
SELECT username,
  CASE
    WHEN password = '$2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC'
    THEN 'Password123'
    ELSE 'OLD PASSWORD'
  END as password_status
FROM account;

-- Check system_config data
SELECT key, value->>'company_name' as company_name
FROM system_config
WHERE key = 'company_info';

-- Check role_permission counts
SELECT position, COUNT(*) as permission_count
FROM role_permission
GROUP BY position
ORDER BY position;

-- Verify staff columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'staff'
  AND column_name IN ('created_at', 'updated_at', 'preferences');

-- Verify account.updated_at
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'account'
  AND column_name = 'updated_at';
```

## Rollback Strategy

**Important:** These migrations use `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` clauses, making them idempotent (safe to run multiple times).

If you need to rollback:

```sql
-- Rollback in reverse order
DROP TABLE IF EXISTS role_permission CASCADE;
DROP TYPE IF EXISTS resource_enum;
DROP TYPE IF EXISTS permission_enum;

DROP TABLE IF EXISTS config_catalog CASCADE;
DROP TYPE IF EXISTS catalog_type_enum;

DROP TABLE IF EXISTS system_config CASCADE;

ALTER TABLE staff DROP COLUMN IF EXISTS preferences;
ALTER TABLE staff DROP COLUMN IF EXISTS updated_at;
ALTER TABLE staff DROP COLUMN IF EXISTS created_at;

ALTER TABLE account DROP COLUMN IF EXISTS updated_at;
DROP TRIGGER IF EXISTS trigger_account_updated_at ON account;
DROP FUNCTION IF EXISTS update_account_updated_at();

DROP TABLE IF EXISTS login_session CASCADE;

-- Note: Cannot remove enum value once added (PostgreSQL limitation)
-- For admin position, you would need to recreate the enum
```

## Testing Credentials

After migrations, use these credentials:

- **Username:** admin
- **Password:** Password123

All seed accounts use the same password: Password123

## Notes

1. **Order Matters:** Always apply migrations in numerical order
2. **Idempotent:** All migrations use `IF NOT EXISTS` / `ON CONFLICT` for safety
3. **Production:** Test on staging environment before applying to production
4. **Backup:** Always backup Neon database before applying migrations
5. **Enum Limitations:** PostgreSQL doesn't support removing enum values; adding is one-way operation

## Support

For issues or questions about migrations:

1. Check verification queries above
2. Review [SETTINGS_IMPLEMENTATION.md](../../docs/SETTINGS_IMPLEMENTATION.md)
3. Check application logs for database connection errors
