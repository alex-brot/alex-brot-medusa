FROM node:20-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app/medusa

RUN apt-get update && apt-get install -y python3 --no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@8
RUN pnpm --version

COPY src/ ./src/
COPY package.json pnpm-lock.yaml tsconfig.json medusa-config*.ts ./

FROM base as prod-deps
RUN rm -rf /pnpm/store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --no-verify-store-integrity

FROM base as builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build && echo "Build completed" && ls -la /app/medusa

FROM node:20-slim
WORKDIR /app/medusa

RUN mkdir ./.medusa/
COPY --from=builder /app/medusa/.medusa ./.medusa
RUN ln -s .medusa/server/public/ public
COPY --from=prod-deps /app/medusa/node_modules ./node_modules

RUN npm install -g @medusajs/medusa-cli

EXPOSE 9000

ENTRYPOINT ["sh", "-c", "cd .medusa/server/ && npx medusa db:migrate && npx medusa start"]

