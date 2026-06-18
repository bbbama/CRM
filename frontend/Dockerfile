# Etap 1: Budowanie
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etap 2: Serwowanie (Nginx)
FROM nginx:stable-alpine
# Kopiujemy własną konfigurację Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Kopiujemy zbudowane pliki frontendu
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
