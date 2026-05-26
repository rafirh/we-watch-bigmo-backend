# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
RUN npm run build


FROM node:24-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated
RUN npx prisma generate


FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/generated ./src/generated
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/server.js"]
