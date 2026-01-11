# ==============================================================================
# REAL ESTATE MANAGEMENT SYSTEM - Makefile
# ==============================================================================
# Quick commands for development workflow
# Usage: make <target>
# ==============================================================================

.PHONY: help install dev up down logs clean test lint format db-reset

# Colors for terminal output
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

# Default target
help:
	@echo ""
	@echo "$(GREEN)Real Estate Management System - Development Commands$(NC)"
	@echo "======================================================"
	@echo ""
	@echo "$(YELLOW)Setup:$(NC)"
	@echo "  make install      Install all dependencies (backend + frontend)"
	@echo "  make setup        Full setup (install + create .env files)"
	@echo ""
	@echo "$(YELLOW)Development:$(NC)"
	@echo "  make dev          Start backend + database (hot-reload)"
	@echo "  make dev-full     Start all services (backend + frontend + db)"
	@echo "  make dev-tools    Start backend + db + Adminer (db GUI)"
	@echo "  make up           Start all services in background"
	@echo "  make down         Stop all services"
	@echo "  make logs         View backend logs"
	@echo "  make logs-db      View database logs"
	@echo ""
	@echo "$(YELLOW)Database:$(NC)"
	@echo "  make db-reset     Reset database (delete all data + re-init)"
	@echo "  make db-shell     Open PostgreSQL shell"
	@echo "  make db-gui       Start Adminer (database web GUI)"
	@echo ""
	@echo "$(YELLOW)Testing & Quality:$(NC)"
	@echo "  make test         Run backend tests"
	@echo "  make lint         Run ESLint"
	@echo "  make format       Format code with Prettier"
	@echo ""
	@echo "$(YELLOW)Cleanup:$(NC)"
	@echo "  make clean        Stop containers + remove volumes"
	@echo ""

# ==============================================================================
# SETUP
# ==============================================================================

install:
	@echo "📦 Installing backend dependencies..."
	cd backend && npm install
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ All dependencies installed!"

setup: install
	@echo "📋 Creating .env files..."
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env; \
		echo "✅ Created backend/.env"; \
	else \
		echo "⚠️  backend/.env already exists, skipping..."; \
	fi
	@if [ ! -f frontend/.env ]; then \
		cp frontend/.env.example frontend/.env 2>/dev/null || echo "ℹ️  No frontend/.env.example found"; \
		echo "✅ Created frontend/.env"; \
	fi
	@echo ""
	@echo "🔧 Please edit backend/.env with your settings:"
	@echo "   - JWT_SECRET and JWT_REFRESH_SECRET"
	@echo "   - Cloudinary credentials (optional)"
	@echo ""

# ==============================================================================
# DEVELOPMENT
# ==============================================================================

dev:
	@echo "🚀 Starting development environment (backend + database)..."
	docker-compose up db backend

dev-full:
	@echo "🚀 Starting full development environment..."
	docker-compose --profile full up

up:
	@echo "🚀 Starting services in background..."
	docker-compose up -d db backend
	@echo ""
	@echo "✅ Services started!"
	@echo "   - Backend API: http://localhost:8081"
	@echo "   - API Docs:    http://localhost:8081/api-docs"
	@echo "   - Health:      http://localhost:8081/health"
	@echo ""

down:
	@echo "🛑 Stopping all services..."
	docker-compose down

logs:
	docker-compose logs -f backend

logs-db:
	docker-compose logs -f db

# ==============================================================================
# DATABASE
# ==============================================================================

db-reset:
	@echo "⚠️  This will DELETE all data. Press Ctrl+C to cancel..."
	@sleep 3
	docker-compose down -v
	docker-compose up -d db
	@echo "⏳ Waiting for database to initialize..."
	@sleep 5
	docker-compose up -d backend
	@echo "✅ Database reset complete!"

db-shell:
	docker-compose exec db psql -U $$POSTGRES_USER -d $$POSTGRES_DB

db-gui:
	@echo "🗄️  Starting Adminer (Database Web GUI)..."
	@echo "⚠️  Note: If services are already running, you may need to restart with 'make down' first"
	docker-compose --profile tools up -d db adminer
	@echo ""
	@echo "✅ Adminer started!"
	@echo "   - URL: http://localhost:8082"
	@echo "   - System: PostgreSQL"
	@echo "   - Server: db"
	@echo "   - Username: (see docker-compose.yml or .env)"
	@echo "   - Password: (see docker-compose.yml or .env)"
	@echo "   - Database: se100_dev_db"
	@echo ""

dev-with-tools:
	@echo "🚀 Starting development environment with database GUI..."
	docker-compose --profile tools up db backend adminer

dev-tools: dev-with-tools

# ==============================================================================
# TESTING & QUALITY
# ==============================================================================

test:
	cd backend && npm test

lint:
	cd backend && npm run lint

format:
	cd backend && npm run format

# ==============================================================================
# CLEANUP
# ==============================================================================

clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v --remove-orphans
	@echo "✅ Cleanup complete!"
