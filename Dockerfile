FROM node:18 as builder

WORKDIR /app/admin

ENV NODE_OPTIONS=--openssl-legacy-provider

COPY . .

RUN rm -rf node_modules

RUN yarn install

RUN yarn build:admin

EXPOSE 7001
EXPOSE 9000

ENTRYPOINT ["yarn", "start"]