FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build || true


FROM nginx:alpine

COPY --from=build /app/front-dist /var/www/html/front-dist


CMD ["nginx", "-g", "daemon off;"]




