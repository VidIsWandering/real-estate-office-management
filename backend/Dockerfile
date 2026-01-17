# ==============================================================================
# REAL ESTATE MANAGEMENT SYSTEM - Backend Dockerfile
# ==============================================================================
# Multi-stage build với named stages để có thể target riêng
# Usage:
#   Development: docker build --target dev -t se100-backend:dev .
#   Production:  docker build --target production -t se100-backend:prod .
# ==============================================================================

# ----- Stage 1: Base -----
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies for better compatibility
RUN apk add --no-cache libc6-compat

# ----- Stage 2: Development -----
FROM base AS dev

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Development port
EXPOSE 8080

# Development command (with hot-reload via nodemon)
CMD ["npm", "run", "dev"]


# ----- Stage 3: Production -----
FROM base AS production

# Copy only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src ./src

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

# Production port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Production command
CMD ["npm", "start"]
