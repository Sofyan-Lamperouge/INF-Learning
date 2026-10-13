# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files saja dulu
COPY package.json package-lock.json ./

# Install pakai npm install (bukan npm ci) — lebih toleran
RUN npm install --no-audit --no-fund

# Force permission untuk semua binary
RUN chmod -R +x node_modules/.bin/ || true

# Copy source code (node_modules sudah di-exclude oleh .dockerignore)
COPY . .

# Build
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]