FROM node:18-alpine AS build

WORKDIR /app

ARG VITE_API_URL=http://localhost:8080/api
ARG VITE_BASE_URL=http://localhost
ARG VITE_API_2FA_URL=http://localhost/twofactor
ARG NODE_ENV=production

ENV NODE_ENV=$NODE_ENV
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_API_2FA_URL=$VITE_API_2FA_URL

COPY package*.json ./

# CORRECTION : Installer TOUTES les dépendances (y compris devDependencies)
RUN npm ci

COPY . .
RUN npm run build 

FROM alpine:latest

# Créer le répertoire et copier les fichiers
RUN mkdir -p /usr/share/nginx/html
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Juste garder les fichiers disponibles, pas de serveur nginx ici
CMD ["tail", "-f", "/dev/null"]