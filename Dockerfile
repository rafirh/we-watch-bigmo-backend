# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --no-save tsx

COPY . .

ENV NODE_ENV=production

RUN npx prisma generate
RUN npm run build


EXPOSE 3000
CMD ["node", "dist/server.js"]
