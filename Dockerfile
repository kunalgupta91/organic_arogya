# syntax=docker/dockerfile:1

# --- deps: install dependencies only (cached separately from source changes) ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# --- builder: generate Prisma client and build the app ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# DATABASE_URL only needs to be *valid-looking* at build time (no routes
# are statically prerendered against a real DB — see sitemap.ts's fallback).
# NEXT_PUBLIC_* vars are different: Next.js inlines them into the client
# JS bundle during `next build`, so they must be their *real* values here,
# not runtime-only — pass them with `docker build --build-arg`.
ENV NEXT_TELEMETRY_DISABLED=1
ARG DATABASE_URL="postgresql://user:password@localhost:5432/db"
ENV DATABASE_URL=${DATABASE_URL}
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=${NEXT_PUBLIC_RAZORPAY_KEY_ID}

RUN npx prisma generate
RUN npm run build

# --- runner: minimal production image ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Note: this image intentionally does NOT include the `prisma` CLI or
# prisma/ folder — Next's standalone output only bundles what the running
# server needs (the generated @prisma/client runtime), not dev tooling.
# Run `npm run db:deploy` (prisma migrate deploy) from CI or a machine with
# the full node_modules and a production DATABASE_URL, as its own step
# before/after deploying a new image — see DEPLOYMENT.md.

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
