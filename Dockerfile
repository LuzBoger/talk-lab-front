FROM node:latest AS build
ARG NODE_ENV
ARG API_URL

ENV NODE_ENV=${NODE_ENV}
ENV API_URL=${API_URL}
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 

# Étape de production avec nginx
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Copier le fichier .env pour référence
COPY .env /usr/share/nginx/html/

# Copier et configurer l'entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Configuration nginx personnalisée si nécessaire
COPY nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]