# 🚀 SE100 Project: Real Estate Office Management

This repository contains a Real Estate Office Management system with a **Frontend** (Next.js), **Backend** (Node.js/Express), and **Database** (PostgreSQL).

## 📋 Table of Contents

- [System Requirements](#1-system-requirements)
- [Local Development](#2-local-development)
- [API Documentation](#api-documentation)
- [Workflow](#3-workflow)
- [Cloud Environments](#4-cloud-environments)

## 1. System Requirements

Before getting started, install the following:

- **Git**
- **Docker Desktop** (ensure Docker is running before executing commands)
- **Make** (optional — the Makefile provides convenience targets)

## 2. Local Development

### 🚀 Quick Start (using Make)

```bash
# 1. Initial setup
make setup

# 2. Edit backend/.env to set JWT secrets and other required configs

# 3. Start development environment
make dev

# 4. Access services
# - API: http://localhost:8081
# - Swagger Docs: http://localhost:8081/api-docs
```

### 📝 Detailed Steps

#### Step 1: Obtain Secrets

This project requires environment variables to run.

**Cloudinary account**: Each team member should create a free Cloudinary account for file upload testing.

From Cloudinary Dashboard, obtain the following keys:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**JWT secrets**: Generate two random secrets for tokens:

```bash
# Run twice to generate two distinct keys
openssl rand -base64 32
```

#### Step 2: Prepare `.env`

```bash
# Copy example env file
cp backend/.env.example backend/.env

# Edit the file
nano backend/.env  # or use your preferred editor
```

Required variables:

- `JWT_SECRET` — secret for access tokens
- `JWT_REFRESH_SECRET` — secret for refresh tokens

#### Step 3: Start Docker

```bash
# Recommended: use Makefile
make dev

# Or use docker-compose directly
docker-compose up db backend
```

#### Step 4: Access Local Services

| Service      | URL                                 | Description    |
| ------------ | ----------------------------------- | -------------- |
| Backend API  | http://localhost:8081               | REST API       |
| **API Docs** | http://localhost:8081/api-docs      | **Swagger UI** |
| OpenAPI JSON | http://localhost:8081/api-docs.json | OpenAPI spec   |
| Health Check | http://localhost:8081/health        | Server status  |
| Database     | localhost:5433                      | PostgreSQL     |

### Useful Commands

```bash
# Show available make targets
make help

# Development
make dev          # Run backend + db (hot-reload)
make up           # Run in background
make down         # Stop services
make logs         # Tail backend logs

# Database
make db-reset     # Reset the database (wipe data and re-init)
make db-shell     # Open PostgreSQL shell
make db-gui       # Start Adminer (DB web GUI)

# Quality
make test         # Run backend tests
make lint         # Run ESLint
make format       # Format code with Prettier
```

## API Documentation

After the backend is running, visit **Swagger UI**:

👉 **http://localhost:8081/api-docs**

### API Modules

| Module       | Prefix                 | Description                       |
| ------------ | ---------------------- | --------------------------------- |
| Auth         | `/api/v1/auth`         | Login, register, password reset   |
| Staff        | `/api/v1/staff`        | Staff management                  |
| Clients      | `/api/v1/clients`      | Client management                 |
| Real Estates | `/api/v1/real-estates` | Real estate listings & management |
| Appointments | `/api/v1/appointments` | Viewing appointments              |
| Transactions | `/api/v1/transactions` | Transactions & negotiations       |
| Contracts    | `/api/v1/contracts`    | Contract management               |
| Vouchers     | `/api/v1/vouchers`     | Payment vouchers                  |
| Reports      | `/api/v1/reports`      | Reporting & analytics             |
| System       | `/api/v1/system`       | System configuration              |

### Roles & Permissions

> **Architecture**: Layered architecture, Service → Repository pattern

| Role            | Description                                     |
| --------------- | ----------------------------------------------- |
| `manager`       | Manage staff, view reports, audit logs          |
| `agent`         | Manage properties, clients, appointments, deals |
| `legal_officer` | Legal checks and contract handling              |
| `accountant`    | Manage vouchers and payments                    |

### Test Accounts (Development)

| Username    | Password    | Role          |
| ----------- | ----------- | ------------- |
| manager1    | password123 | manager       |
| agent1      | password123 | agent         |
| legal1      | password123 | legal_officer |
| accountant1 | password123 | accountant    |

Notes:

- `--build` is required only the first time or when Dockerfiles change.
- `-d` runs containers in detached mode.

### Local Access After Containers Start

It may take 1–2 minutes for containers to initialize on first run. Available services:

- **Frontend (Next.js)**: http://localhost:3000
- **Backend (Node.js)**: http://localhost:8081
- **Database (Postgres)**: localhost:5433 (connect with DataGrip/DBeaver if needed)

### Docker Useful Commands

**Start (create or recreate containers)**:

```bash
docker compose up -d
```

**Tail backend logs**:

```bash
docker compose logs -f backend
```

**Stop and remove containers**:

```bash
docker compose down
```

## 3. Workflow

**DO NOT** push directly to `main` or `develop`.

1. **Start from `develop`**:

```bash
git checkout develop
git pull origin develop
```

2. **Create a feature branch**: Use `feature/<feature-name>` (e.g. `feature/be-login-api`)

```bash
git checkout -b feature/your-feature-name
```

3. **Code & Commit** on the feature branch.

4. **Create a Pull Request (PR)**:

```bash
git push -u origin feature/your-feature-name
```

Then open a PR from your branch into `develop` on GitHub.

5. **Review & Merge**: Assign reviewers. After approval, the leader or maintainer will merge the PR.

## 4. Cloud Environments

### Staging

- **Frontend**: https://real-estate-offic-git-8f9a7b-nguyen-quoc-baos-projects-076482f2.vercel.app/
- **Backend**: https://real-estate-office-management-stag.onrender.com/

Purpose: Automatic deployments from `develop` branch for team integration testing.

### Production (Demo)

- **Frontend**: https://real-estate-office-management-prod.vercel.app/
- **Backend**: https://real-estate-office-management-prod.onrender.com/

Purpose: Only leaders merge to `main`. Used for demos to instructors.
# Trigger Vercel rebuild with env vars
