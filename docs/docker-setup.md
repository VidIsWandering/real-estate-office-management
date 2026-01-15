# Docker Development Setup

## Quick Start

```bash
# 1. Setup (first time only)
make setup

# 2. Start all services
make up
# Or run in foreground with logs:
make dev

# 3. Access the application
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8081
# - API Docs: http://localhost:8081/api-docs
# - Database: localhost:5433
```

## Common Commands

```bash
# Development
make dev          # Start all services (frontend + backend + db) with logs
make up           # Start all services in background
make down         # Stop all services
make restart      # Quick restart without rebuild
make rebuild      # Rebuild and restart (after dependency changes)

# Logs
make logs         # View all logs
make logs-backend # View backend logs only
make logs-frontend # View frontend logs only
make logs-db      # View database logs only

# Database
make db-reset     # Reset database (deletes all data)
make db-shell     # Open PostgreSQL shell
make adminer      # Start database web GUI

# Testing
make test         # Run backend tests
make lint         # Run linters
make format       # Format code

# Cleanup
make clean        # Stop and remove all containers + volumes
```

## Service Configuration

### Ports

- **Frontend**: 3000
- **Backend**: 8081 (maps to 8080 inside container)
- **Database**: 5433 (maps to 5432 inside container)
- **Adminer**: 8082 (optional, use `make adminer`)

### Environment Variables

Create `.env` in root directory (or run `make setup`):

```env
# Database
DB_USER=devuser
DB_PASSWORD=devpassword
DB_NAME=se100_dev_db
DB_EXTERNAL_PORT=5433

# Service Ports
BACKEND_PORT=8081
FRONTEND_PORT=3000
ADMINER_PORT=8082

# Environment
NODE_ENV=development
```

## Architecture

```
┌─────────────────┐
│   Frontend      │  Next.js 15 (Port 3000)
│   (Next.js)     │  Hot-reload enabled
└────────┬────────┘
         │
         │ HTTP API calls
         ▼
┌─────────────────┐
│   Backend       │  Node.js 20 (Port 8081)
│   (Express)     │  Hot-reload via nodemon
└────────┬────────┘
         │
         │ SQL queries
         ▼
┌─────────────────┐
│   Database      │  PostgreSQL 15 (Port 5433)
│   (PostgreSQL)  │  Auto-init with script.sql
└─────────────────┘
```

## Hot-Reload

Both frontend and backend support hot-reload:

- **Frontend**: Files in `frontend/src/` auto-reload
- **Backend**: Files in `backend/src/` auto-reload via nodemon

Changes appear instantly without rebuilding containers.

## Troubleshooting

### Containers won't start

```bash
make clean  # Remove everything
make up     # Fresh start
```

### Port already in use

Edit `.env` to change ports:

```env
FRONTEND_PORT=3001
BACKEND_PORT=8082
DB_EXTERNAL_PORT=5434
```

### Database not initializing

```bash
make db-reset  # Reset and re-init database
```

### Hot-reload not working

```bash
make rebuild  # Rebuild containers
```

### View logs

```bash
make logs           # All services
make logs-backend   # Backend only
make logs-frontend  # Frontend only
```

## Production Build

For production deployment, use production targets:

```bash
# Backend
docker build --target production -t se100-backend:prod ./backend

# Frontend
docker build --target production -t se100-frontend:prod ./frontend
```

## Volume Mounts

Development volumes for hot-reload:

- `./backend/src` → `/app/src` (backend code)
- `./frontend/src` → `/app/src` (frontend code)
- `./frontend/public` → `/app/public` (static assets)
- `postgres_data` → `/var/lib/postgresql/data` (database persistence)

Node modules are excluded via anonymous volumes to prevent conflicts.
