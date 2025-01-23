FROM node:23.6.0-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app/medusa

RUN apt-get update && apt-get install -y python3 --no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY src/ ./src/
COPY package.json pnpm-lock.yaml tsconfig.json medusa-config*.ts ./

FROM base as prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base as builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:23.6.0-slim
WORKDIR /app/medusa

RUN mkdir ./.medusa/
COPY --from=builder /app/medusa/.medusa ./.medusa
COPY --from=prod-deps /app/medusa/node_modules ./node_modules

RUN npm install -g @medusajs/medusa-cli

EXPOSE 9000

ENTRYPOINT ["sh", "-c", "cd .medusa/server/ && npx medusa db:migrate && npx medusa start"]

