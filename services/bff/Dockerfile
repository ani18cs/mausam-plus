# ═══════════════════════════════════════════════════════════════════
# MAUSAM+ BFF (Backend-For-Frontend) Production Dockerfile
# Optimized Multi-Stage Build with Non-Root Execution & Signal Handling
# ═══════════════════════════════════════════════════════════════════

# Stage 1: Build & TypeScript Compilation
FROM node:20-alpine AS builder

WORKDIR /app

# Install build tools if required
RUN apk add --no-cache libc6-compat

# Copy root manifest and workspace package files
COPY package*.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/shared-types/tsconfig*.json ./packages/shared-types/
COPY packages/shared-types/src/ ./packages/shared-types/src/

COPY services/bff/package*.json ./services/bff/
COPY services/bff/tsconfig*.json ./services/bff/
COPY services/bff/src/ ./services/bff/src/

# Install dependencies across monorepo workspace
RUN npm ci

# Build shared types & BFF TypeScript code
RUN npm run build --workspace=@mausam/shared-types
RUN npm run build --workspace=@mausam/bff

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Add dumb-init for reliable PID 1 signal forwarding and graceful container shutdown
RUN apk add --no-cache dumb-init

# Security: Set production environment
ENV NODE_ENV=production
ENV PORT=4000

# Copy built dependencies and compiled output from builder
COPY --chown=node:node package*.json ./
COPY --chown=node:node packages/shared-types/package*.json ./packages/shared-types/
COPY --chown=node:node packages/shared-types/dist/ ./packages/shared-types/dist/
COPY --chown=node:node packages/shared-types/locales/ ./packages/shared-types/locales/

COPY --chown=node:node services/bff/package*.json ./services/bff/
COPY --chown=node:node --from=builder /app/services/bff/dist ./services/bff/dist

# Install production dependencies only
RUN npm ci --omit=dev --workspace=@mausam/shared-types --workspace=@mausam/bff

# Switch to unprivileged non-root user
USER node

EXPOSE 4000

# Health check probe against BFF health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

WORKDIR /app/services/bff

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]
