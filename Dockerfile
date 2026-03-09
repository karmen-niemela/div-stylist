FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY index.html ./
COPY styles.css ./
COPY js/ ./js/

EXPOSE 80

CMD ["node", "server.js"]
