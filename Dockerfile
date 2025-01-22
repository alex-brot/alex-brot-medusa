FROM node:23.6.0-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app/medusa

RUN apt-get update && apt-get install -y python3 --no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

FROM base as prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base as builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:23.6.0-slim
WORKDIR /app/medusa

COPY --from=prod-deps /app/medusa/node_modules ./node_modules
COPY --from=builder /app/medusa/.medusa ./ ./

RUN pnpm install -g @medusajs/medusa-cli

EXPOSE 9000

ENTRYPOINT ["sh", "-c", "npx medusa db:migrate && npx medusa start"]

