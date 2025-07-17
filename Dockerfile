FROM node:24-alpine AS base

WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm

# Development stage
FROM base AS development
RUN pnpm install
COPY . .
EXPOSE 3000
CMD pnpm dev

# Production stage
FROM base AS production
# Install ALL dependencies (including devDependencies) for the build
RUN pnpm install --frozen-lockfile
COPY . .
# Build the application
RUN pnpm build
# Remove devDependencies after build
RUN pnpm prune --prod
EXPOSE 3000
CMD pnpm start