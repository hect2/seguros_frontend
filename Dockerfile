# ---------- Stage 1: Build ----------
FROM node:18-alpine AS build

WORKDIR /app

# Copiamos package.json para instalar dependencias primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Run build
RUN npm run build



# ---------- Stage 2: Serve (Nginx) ----------
FROM nginx:alpine

# Elimina la configuración por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia el archivo de configuración personalizado de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos del build al folder de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# OJO: para Create React App usa:
# COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
