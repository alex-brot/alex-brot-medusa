FROM node:18-alpine

WORKDIR /app/admin

ENV NODE_OPTIONS=--openssl-legacy-provider

COPY . .

RUN rm -rf node_modules

RUN npm install

RUN npm run build

EXPOSE 9000

ENTRYPOINT ["sh", "-c", "npx medusa db:migrate && npm run start"]