FROM node:23.6.0 as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app/medusa

RUN apt-get update && apt-get install -y python3 && rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY . .

FROM base as prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base as builder

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm run build

FROM base

COPY --from=prod-deps /app/medusa/node_modules /app/medusa/node_modules
COPY --from=builder /app/medusa/.medusa /app/medusa/.medusa
#COPY --from=builder /app/medusa/dist /app/medusa/dist

RUN pnpm install -g @medusajs/medusa-cli
RUN npm i --only=production

EXPOSE 9000

ENTRYPOINT ["sh", "-c", "npx medusa db:migrate && npx medusa start"]

