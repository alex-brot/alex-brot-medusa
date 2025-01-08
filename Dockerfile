FROM node:23.6.0 as builder

WORKDIR /app/medusa

COPY . .

RUN rm -rf node_modules

RUN apt-get update

RUN apt-get install -y python3

RUN npm install -g npm@latest

RUN npm install --loglevel=error

RUN npm run build


FROM node:23.6.0-alpine3.20

WORKDIR /app/medusa

COPY tsconfig.json ./

COPY package*.json ./

COPY medusa-config.prod.ts ./medusa-config.ts

COPY src ./src

RUN mkdir ./.medusa/

COPY --from=builder /app/medusa/.medusa ./.medusa

#RUN apt-get update
#
#RUN apt-get install -y python
RUN apk add --no-cache python3

RUN npm install -g @medusajs/medusa-cli

RUN npm i --only=production

EXPOSE 9000

ENTRYPOINT ["sh", "-c", "npx medusa db:migrate && npx medusa start"]