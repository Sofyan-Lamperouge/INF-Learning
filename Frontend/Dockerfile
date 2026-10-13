# Stage 1: Build aplikasi
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json dan package-lock.json
COPY package.json package-lock.json ./

# Install dependensi (menggunakan npm install, bukan npm ci)
RUN npm install --no-audit --no-fund

# Copy semua source code (node_modules sudah di-exclude oleh .dockerignore)
COPY . .

# Build aplikasi Vite
RUN npm run build

# Stage 2: Sajikan file statis
FROM node:20-alpine

WORKDIR /app

# Install 'serve' untuk menyajikan file statis
RUN npm install -g serve

# Copy hasil build dari stage pertama
COPY --from=builder /app/dist ./dist

# Expose port (Railway akan inject PORT)
EXPOSE 3000

# Jalankan serve, menggunakan PORT dari environment variable
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]