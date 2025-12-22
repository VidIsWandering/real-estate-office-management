# ==============================================================================
# REAL ESTATE MANAGEMENT SYSTEM - Backend Dockerfile
# ==============================================================================
# Multi-stage build với named stages để có thể target riêng
# Usage:
#   Development: docker build --target builder -t se100-backend:dev .
#   Production:  docker build --target production -t se100-backend:prod .
# ==============================================================================

# ----- Stage 1: Builder (Development) -----
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Development port
EXPOSE 8080

# Development command (with hot-reload via nodemon)
CMD ["npm", "run", "dev"]


# ----- Stage 2: Production -----
FROM node:18-alpine AS production

WORKDIR /app

# Copy only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --from=builder /app/src ./src

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
