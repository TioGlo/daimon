FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY gateway.js ./

EXPOSE 4021

CMD ["node", "gateway.js"]
