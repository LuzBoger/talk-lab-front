# build stage
FROM node:18-alpine AS build

WORKDIR /app

ARG VITE_API_URL=https://talklab.fr/api
ARG VITE_BASE_URL=https://talklab.fr
ARG VITE_API_2FA_URL=https://talklab.fr/twofactor
ARG VITE_GOOGLE_CLIENT_ID=523525147188-89ftltikud192it0r1iuu4sq024qiqo1.apps.googleusercontent.com

ENV NODE_ENV=$NODE_ENV
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_API_2FA_URL=$VITE_API_2FA_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

COPY package*.json ./
RUN npm cache clean --force
RUN npm install --include=dev

COPY . .
RUN npm run build

# production stage - juste les fichiers statiques
FROM alpine:latest

# Créer le répertoire
RUN mkdir -p /usr/share/nginx/html

# Copier les fichiers buildés
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Garder le conteneur en vie (pour volume sharing)
CMD ["tail", "-f", "/dev/null"]