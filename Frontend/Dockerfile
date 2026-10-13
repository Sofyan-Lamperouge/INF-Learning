# Stage 1: Build aplikasi
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm ci

# Copy semua source code
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

# Expose port
EXPOSE 3000

# Jalankan serve untuk menyajikan folder dist
CMD ["serve", "-s", "dist", "-l", "3000"]