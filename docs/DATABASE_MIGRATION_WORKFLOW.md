# Database Migration Workflow

## 📋 Overview

This document explains how to handle database schema changes in our project.

---

## 🏗️ Two Strategies

### 1. **script.sql** (Full Schema)

**Purpose:** Create database from scratch

**Used for:**

- ✅ Local development (Docker auto-runs)
- ✅ CI/CD testing (fresh database each run)
- ✅ Initial setup staging/production (ONE TIME)

**Location:** `backend/script.sql`

**When to update:**

- Every time you make any database schema change
- This ensures new developers get latest schema

---

### 2. **migrations/** (Incremental Updates)

**Purpose:** Update existing database without losing data

**Used for:**

- ✅ Staging database updates (after initial setup)
- ✅ Production database updates (after initial setup)

**Location:** `backend/migrations/XXX_description.sql`

**Naming convention:**

```
001_add_login_session.sql
002_update_account_password.sql
003_add_system_config.sql
...
009_add_new_feature.sql  ← Next one you create
```

---

## 🔄 Workflow for Database Changes

### **Scenario: You need to add a new table/column**

#### **Step 1: Create Migration File**

```bash
# Create new migration file with next number
touch backend/migrations/009_add_notifications_table.sql
```

**Content example:**

```sql
-- Migration: Add notifications table
-- Date: 2026-01-15
-- Author: Your Name

-- Add new table
CREATE TABLE IF NOT EXISTS notification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES account(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index
CREATE INDEX IF NOT EXISTS idx_notification_user ON notification(user_id);

-- Add sample data (optional)
INSERT INTO notification (user_id, message)
SELECT id, 'Welcome to the system!'
FROM account
WHERE username = 'admin'
ON CONFLICT DO NOTHING;
```

**⚠️ Important:**

- Use `IF NOT EXISTS` to make migration idempotent
- Use `ON CONFLICT DO NOTHING` for inserts
- Always include rollback instructions in comments

---

#### **Step 2: Update script.sql**

Add the same changes to `backend/script.sql` so new local environments get the schema:

```sql
-- In script.sql, add your new table after existing tables
CREATE TABLE notification (
  ...
);
```

---

#### **Step 3: Test Locally**

```bash
# Rebuild local database with new schema
docker-compose down -v
docker-compose up -d

# Wait for backend to start, then test
curl http://localhost:8081/health
```

---

#### **Step 4: Commit & Create PR**

```bash
git add backend/migrations/009_add_notifications_table.sql
git add backend/script.sql
git commit -m "feat: add notifications table"
git push origin feature/notifications
```

**PR Checklist Template:**

```markdown
## Database Changes

- [ ] Migration file created: `migrations/009_add_notifications_table.sql`
- [ ] `script.sql` updated with same changes
- [ ] Tested locally (Docker)
- [ ] Idempotent (can run multiple times safely)
- [ ] Includes rollback instructions
```

---

#### **Step 5: After Merge to `develop` (Staging)**

**Code deploys automatically to Render staging, but database needs manual update:**

```bash
# Get staging database connection string from Neon
# Navigate to: https://console.neon.tech/ → Project → Development DB

# Run migration
psql "postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require" \
  -f backend/migrations/009_add_notifications_table.sql

# Verify
psql "postgresql://..." -c "\dt notification"
```

**Test staging:**

```bash
curl https://real-estate-office-management-stag.onrender.com/api/v1/notifications
```

---

#### **Step 6: After Merge to `main` (Production)**

**Code deploys automatically to Render production, but database needs manual update:**

```bash
# Get PRODUCTION database connection string from Neon
# Navigate to: https://console.neon.tech/ → Project → Production DB

# Run migration (CAREFULLY!)
psql "postgresql://user:pass@ep-xxx-prod.neon.tech/dbname?sslmode=require" \
  -f backend/migrations/009_add_notifications_table.sql

# Verify
psql "postgresql://..." -c "\dt notification"
```

**Test production:**

```bash
curl https://real-estate-office-management-prod.onrender.com/api/v1/notifications
```

---

## 🚨 Important Rules

### **DO's:**

- ✅ Always create numbered migration files
- ✅ Always update script.sql
- ✅ Test locally before PR
- ✅ Use `IF NOT EXISTS` and `ON CONFLICT DO NOTHING`
- ✅ Include comments explaining the change
- ✅ Run migrations on staging before production

### **DON'Ts:**

- ❌ Never run script.sql on staging/production (after initial setup)
- ❌ Never delete old migration files
- ❌ Never edit migration files after they're merged
- ❌ Never run migrations without testing locally first

---

## 🔍 Troubleshooting

### **Problem: Migration already applied**

**Symptom:**

```
ERROR: relation "notification" already exists
```

**Solution:**
This is normal if migration uses `IF NOT EXISTS`. If not, the migration already ran successfully.

---

### **Problem: Migration fails halfway**

**Solution:**

1. Check Neon logs to see what succeeded
2. Fix the migration file
3. Test locally
4. Manually fix staging/production database
5. Run corrected migration

---

### **Problem: Need to rollback**

**Solution:**

1. Create a new migration that reverses changes:
   ```sql
   -- migrations/010_rollback_notifications.sql
   DROP TABLE IF EXISTS notification;
   ```
2. Follow normal workflow

---

## 📊 Database State Tracking

### **Check what migrations have been applied:**

```bash
# Option 1: Check table existence
psql "CONNECTION_STRING" -c "\dt"

# Option 2: Check specific table
psql "CONNECTION_STRING" -c "\d notification"

# Option 3: Query data
psql "CONNECTION_STRING" -c "SELECT COUNT(*) FROM notification;"
```

---

## 🎯 Quick Reference

### **Initial Setup (ONE TIME ONLY)**

```bash
# Staging
psql "STAGING_CONNECTION" -f backend/script.sql

# Production (after merging to main)
psql "PROD_CONNECTION" -f backend/script.sql
```

---

### **Regular Updates (AFTER INITIAL SETUP)**

```bash
# Local (automatic)
docker-compose down -v && docker-compose up -d

# Staging (manual after deploy)
psql "STAGING_CONNECTION" -f backend/migrations/XXX_new_change.sql

# Production (manual after deploy)
psql "PROD_CONNECTION" -f backend/migrations/XXX_new_change.sql
```

---

## 📞 Questions?

If you're unsure about a database change:

1. Ask in team chat before creating migration
2. Get review from lead developer
3. Test thoroughly on staging before production
4. Document any manual steps needed

---

**Last updated:** January 15, 2026
