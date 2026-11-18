# syntax=docker/dockerfile:1.7
# One Dockerfile for both Next.js apps plus a "tools" image that runs migrations.
#   docker build -f docker/Dockerfile --build-arg APP=web   --target app   -t beer-web .
#   docker build -f docker/Dockerfile --build-arg APP=admin --target app   -t beer-admin .
#   docker build -f docker/Dockerfile --build-arg APP=web   --target tools -t beer-tools .
ARG NODE_IMAGE=node:24-alpine

FROM ${NODE_IMAGE} AS base
RUN apk add --no-cache libc6-compat && corepack enable
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH NEXT_TELEMETRY_DISABLED=1
WORKDIR /repo

# Keep only the workspace packages the chosen app needs.
FROM base AS pruned
ARG APP
COPY . .
RUN pnpm dlx turbo@2.11.11 prune @beer/${APP} --docker

FROM base AS builder
ARG APP
COPY --from=pruned /repo/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=pruned /repo/out/full/ .
RUN pnpm turbo run build --filter=@beer/${APP}

# Migrations + seed (drizzle + tsx), run once per deploy by docker compose.
FROM builder AS tools
WORKDIR /repo/packages/db
CMD ["sh", "-c", "node --import tsx src/migrate.ts && node --import tsx src/seed.ts"]

FROM ${NODE_IMAGE} AS app
ARG APP
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 APP=${APP}
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs \
  && mkdir -p /data/uploads && chown -R nextjs:nodejs /data
COPY --from=builder --chown=nextjs:nodejs /repo/apps/${APP}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/${APP}/.next/static ./apps/${APP}/.next/static
USER nextjs
CMD ["sh", "-c", "exec node apps/${APP}/server.js"]
