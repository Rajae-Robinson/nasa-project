# syntax = docker/dockerfile:1.2

FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY client/package*.json client/
RUN npm run install-client --omit=dev

COPY server/package*.json server/
RUN npm run install-server --omit=dev

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

RUN --mount=type=secret,id=_env,dst=/etc/secrets/.env cat /etc/secrets/.env

# Create the log directory and set permissions
RUN mkdir -p /app/server/src/utils/logs && \
    chown -R node:node /app/server/src/utils/logs

USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 3001