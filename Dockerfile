# ===========================
# Stage 1 : Build React
# ===========================
FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json et installer les dépendances
COPY package.json .
RUN npm install

# Copier le code source
COPY public ./public
COPY src ./src

# Compiler l'application React
RUN npm run build

# ===========================
# Stage 2 : Serveur web Nginx
# ===========================
FROM nginx:alpine

# Copier les fichiers compilés dans Nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
