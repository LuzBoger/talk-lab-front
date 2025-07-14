FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 

FROM alpine:latest

# Créer le répertoire et copier les fichiers
RUN mkdir -p /usr/share/nginx/html
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Juste garder les fichiers disponibles, pas de serveur nginx ici
CMD ["nginx", "-g", "daemon off;"]



