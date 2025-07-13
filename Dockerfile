FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 

FROM alpine:latest

# Créer le répertoire et copier les fichiers
RUN mkdir -p /var/www/html/front-dist
COPY --from=build /app/dist /var/www/html/front-dist

# Juste garder les fichiers disponibles, pas de serveur nginx ici
CMD ["tail", "-f", "/dev/null"]




