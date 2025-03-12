FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app/medusa

RUN apt-get update && apt-get install -y python3 --no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10.5.2
RUN pnpm --version

COPY src/ ./src/
COPY package.json pnpm-lock.yaml tsconfig.json medusa-config*.ts ./

FROM base AS prod-deps
RUN rm -rf /pnpm/store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile --no-verify-store-integrity && \
    pnpm add -g -g @medusajs/medusa-cli

FROM base AS builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ENV NODE_ENV="production"
RUN pnpm run build && echo "Build completed" && ls -la /app/medusa

FROM node:20-slim
WORKDIR /app/medusa

RUN mkdir ./.medusa/
COPY --from=builder /app/medusa/ .

RUN ln -s .medusa/server/public/ public
COPY --from=prod-deps /app/medusa/node_modules ./node_modules

EXPOSE 9000

ENTRYPOINT ["sh", "-c", "cd .medusa/server/ && npx medusa db:migrate --execute-safe-links && npx medusa start"]

