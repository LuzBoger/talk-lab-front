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
RUN npm ci --only=production

COPY . .
RUN npm run build 

# Stage final avec nginx ou serveur web léger
FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Configuration nginx pour SPA
RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]