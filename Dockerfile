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

FROM alpine:latest


# Créer le répertoire et copier les fichiers
RUN mkdir -p /usr/share/nginx/html
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
# Juste garder les fichiers disponibles, pas de serveur nginx ici
CMD ["tail", "-f", "/dev/null"]




