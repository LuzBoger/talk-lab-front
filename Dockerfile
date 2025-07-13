FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 


FROM nginx:alpine

COPY --from=build /app/dist /var/www/html/front-dist


CMD ["nginx", "-g", "daemon off;"]




