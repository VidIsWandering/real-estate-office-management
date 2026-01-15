# Local Development Setup Guide

## Quick Start (No Manual Steps Required!)

Để bắt đầu dev trên local machine, chỉ cần 3 bước:

```bash
# 1. Clone repository
git clone <repo-url>
cd real-estate-office-management

# 2. Start all services with Docker Compose
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8081/api/v1
# Database GUI: http://localhost:8080 (Adminer)
```

**Không cần chạy migrations thủ công!** Database sẽ tự động được init với `script.sql`.

---

## What Happens on First Start?

### 1. PostgreSQL Container Init

Khi container `db` được tạo lần đầu (empty volume):

- PostgreSQL sẽ tự động chạy file `/docker-entrypoint-initdb.d/init.sql`
- File này được mount từ `./backend/script.sql`
- Database sẽ được tạo với:
  ✅ Tất cả tables (account, staff, client, real_estate, etc.)
  ✅ All ENUMs (staff_position_enum, client_type_enum, etc.)
  ✅ Settings tables (system_config, config_catalog, role_permission, login_session)
  ✅ Sample data (5 accounts, staff, catalogs, permissions)
  ✅ Indexes và foreign keys
  ✅ Triggers (account.updated_at auto-update)

### 2. Backend Container

- Connects to database via `DB_HOST=db` (container name)
- Auto-reload khi code thay đổi (nodemon)
- Listens on port 8080 (mapped to 8081 on host)

### 3. Frontend Container

- Hot-reload enabled (Next.js dev server)
- API calls to `http://localhost:8081/api/v1`
- Port 3000

---

## Database Access

### Testing Credentials

Login to the application:

- **Username:** `admin`
- **Password:** `Password123`

Other test accounts:

- manager1 / Password123
- agent1 / Password123
- legal1 / Password123
- accountant1 / Password123

### Direct Database Access

**Option 1: Adminer (Web GUI)**

- URL: http://localhost:8080
- System: PostgreSQL
- Server: `db`
- Username: `devuser`
- Password: `devpassword`
- Database: `se100_dev_db`

**Option 2: psql Command Line**

```bash
# From host machine
docker exec -it se100-db psql -U devuser -d se100_dev_db

# Or use external port
psql -h localhost -p 5433 -U devuser -d se100_dev_db
```

**Option 3: Database IDE**
Configure connection:

- Host: `localhost`
- Port: `5433`
- User: `devuser`
- Password: `devpassword`
- Database: `se100_dev_db`

---

## Database Reset

Nếu muốn reset database về trạng thái ban đầu:

```bash
# Stop và xóa containers + volumes
docker-compose down -v

# Start lại (sẽ tự động init database mới)
docker-compose up -d

# Check logs để xem init progress
docker-compose logs db
```

**Lưu ý:** `-v` flag sẽ xóa PostgreSQL data volume!

---

## Environment Variables

### Default Values (No config needed)

Docker Compose đã có defaults trong file:

```yaml
DB_USER: devuser
DB_PASSWORD: devpassword
DB_NAME: se100_dev_db
DB_EXTERNAL_PORT: 5433
BACKEND_PORT: 8081
FRONTEND_PORT: 3000
```

### Custom Configuration (Optional)

Nếu muốn override, tạo file `.env` ở root:

```bash
# Database
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydb
DB_EXTERNAL_PORT=5432

# Backend
BACKEND_PORT=3001

# Frontend
FRONTEND_PORT=3000
```

---

## Development Workflow

### 1. Code Changes

**Backend (Hot Reload):**

- Edit files trong `backend/src/`
- Nodemon tự động restart server
- Check logs: `docker-compose logs -f backend`

**Frontend (Hot Reload):**

- Edit files trong `frontend/src/`
- Next.js tự động rebuild
- Check logs: `docker-compose logs -f frontend`

### 2. Database Changes

**Adding new tables/columns:**

1. Cập nhật `backend/script.sql`
2. Reset database: `docker-compose down -v && docker-compose up -d`
3. Hoặc chạy SQL manually qua Adminer

**Testing migrations:**

- Migrations trong `backend/migrations/` chỉ dùng cho production (Neon)
- Local dev luôn dùng `script.sql` cho clean slate

### 3. Running Tests

```bash
# Backend tests
docker exec -it se100-backend npm test

# Or from host (if node_modules synced)
cd backend
npm test
```

---

## Troubleshooting

### Container không start

```bash
# Check logs
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs db
```

### Database connection errors

```bash
# Check if db is healthy
docker-compose ps

# Should show:
# se100-db    healthy

# If unhealthy, check logs
docker-compose logs db
```

### Port conflicts

Nếu port 3000, 8081, hoặc 5433 đã được sử dụng:

```bash
# Check what's using the port
lsof -i :3000

# Kill the process hoặc change port trong .env
echo "FRONTEND_PORT=3001" >> .env
docker-compose up -d
```

### Clean rebuild

```bash
# Remove everything and rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Cannot connect to database from host

```bash
# Make sure external port is correct
docker-compose ps

# Should show:
# se100-db    0.0.0.0:5433->5432/tcp

# Test connection
psql -h localhost -p 5433 -U devuser -d se100_dev_db
```

---

## What About Migrations?

### Local Development: `script.sql` (Complete Schema)

- ✅ Use: `backend/script.sql` - Complete database schema
- ✅ Method: Auto-init via Docker entrypoint
- ✅ When: Every fresh database (after `down -v`)
- ✅ Includes: All tables, data, indexes, triggers

### Production (Neon): Migrations (Incremental Updates)

- ✅ Use: `backend/migrations/001-008.sql` - Incremental changes
- ✅ Method: Manual apply or migration runner
- ✅ When: Deploying to production from develop branch
- ✅ Purpose: Update existing database without data loss

**Tại sao 2 approaches?**

1. **Local:** Fresh start mỗi lần → dùng complete schema (`script.sql`)
2. **Production:** Database đang chạy → dùng migrations để update incrementally

---

## Files Structure

```
.
├── docker-compose.yml          # Container orchestration
├── backend/
│   ├── script.sql              # 🔵 COMPLETE SCHEMA (local dev)
│   ├── migrations/             # 🟢 INCREMENTAL (production only)
│   │   ├── 001_add_login_session.sql
│   │   ├── 002_update_passwords.sql
│   │   ├── 003-008...
│   │   └── README.md
│   ├── scripts/
│   │   └── run-migrations.js   # Production migration runner
│   └── src/                    # Application code
├── frontend/
│   └── src/                    # Next.js code
└── LOCAL_DEV_SETUP.md         # 📖 This file
```

---

## Common Tasks

### View all containers

```bash
docker-compose ps
```

### Restart specific service

```bash
docker-compose restart backend
docker-compose restart frontend
```

### View logs (follow)

```bash
docker-compose logs -f
docker-compose logs -f backend  # specific service
```

### Execute commands in container

```bash
# Backend
docker exec -it se100-backend npm run test
docker exec -it se100-backend npm run lint

# Database
docker exec -it se100-db psql -U devuser -d se100_dev_db
```

### Check database tables

```bash
docker exec -it se100-db psql -U devuser -d se100_dev_db -c "\dt"
```

### Export database

```bash
docker exec se100-db pg_dump -U devuser se100_dev_db > backup.sql
```

### Import database

```bash
cat backup.sql | docker exec -i se100-db psql -U devuser -d se100_dev_db
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: cd backend && npm ci

      - name: Init database
        run: psql -h localhost -U testuser -d testdb < backend/script.sql
        env:
          PGPASSWORD: testpass

      - name: Run tests
        run: cd backend && npm test
        env:
          DB_HOST: localhost
          DB_USER: testuser
          DB_PASSWORD: testpass
          DB_NAME: testdb
```

---

## Summary

✅ **Zero manual steps** - Just `docker-compose up -d`
✅ **Auto database init** - script.sql runs automatically
✅ **Hot reload** - Frontend & Backend
✅ **5 test accounts** - admin, manager1, agent1, legal1, accountant1
✅ **Web DB GUI** - Adminer on port 8080
✅ **Clean reset** - `down -v` then `up -d`
✅ **Production ready** - Migrations in `backend/migrations/` for Neon

**Happy coding! 🚀**
