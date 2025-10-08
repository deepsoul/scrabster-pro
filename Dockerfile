# Multi-stage build for Scrabster Pro
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build client
RUN npm run client:build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm install --only=production

# Copy built client
COPY --from=builder /app/client/dist ./client/dist

# Copy server source
COPY server/ ./

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
