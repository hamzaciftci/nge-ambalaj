# Stage 1: Dependencies
FROM node:20-slim AS deps
RUN apt-get update && apt-get install -y openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies including sharp for image optimization
RUN npm ci
RUN npm install sharp

# Stage 2: Build
FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install OpenSSL (required for Prisma)
RUN apt-get update && apt-get install -y openssl ca-certificates

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/sharp ./node_modules/sharp

# Create cache and uploads directories with proper permissions
RUN mkdir -p .next/cache public/uploads && chown -R nextjs:nodejs .next/cache public/uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
