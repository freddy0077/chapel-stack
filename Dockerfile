# Frontend Dockerfile for Next.js
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN #pnpm run build

# Expose port
EXPOSE 3000

# Start the application
#CMD ["pnpm", "run", "start"]
CMD ["pnpm", "run", "dev"]
