# Stage 1: Build (Ambiente de construcción)
FROM node:22-alpine AS build

# Creamos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos dependencias y schema Prisma (postinstall ejecuta prisma generate)
COPY package*.json ./
COPY prisma ./prisma

RUN npm install

# Copiamos el resto del código
COPY . .

RUN npx prisma generate

EXPOSE 3000