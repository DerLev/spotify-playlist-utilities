# build dependencies
FROM node:16-alpine as deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# build client & server
FROM node:16-alpine as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build:client
RUN yarn build:server

# run server
FROM node:16-alpine as runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/package.json .
# above step is needed for nodejs to use es module syntax and don't freak out

EXPOSE 5000
ENV PORT 5000

# associate image with repository
LABEL org.opencontainers.image.source = "https://github.com/DerLev/spotify-playlist-utilities"

CMD [ "node", "dist-server/server.js" ]
