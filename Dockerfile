FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY index.html ./
COPY styles.css ./
COPY js/ ./js/

EXPOSE $PORT

CMD ["node", "server.js"]
