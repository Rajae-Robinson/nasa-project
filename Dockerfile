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

# Create the log directory and set permissions
RUN mkdir -p /app/server/src/utils/logs && \
    chown -R node:node /app/server/src/utils/logs

ENV NODE_ENV=production

USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 3001