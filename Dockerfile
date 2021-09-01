FROM node:16
WORKDIR /bot
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENTRYPOINT [ "node", "index.js" ]