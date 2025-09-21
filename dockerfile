# Usar imagen base de Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar configuración del workspace desde la raíz
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copiar el paquete common
COPY packages/common packages/common

# Copiar los archivos de configuración del gateway
COPY apps/gateway/package.json apps/gateway/

# Instalar dependencias (esto instalará todo el workspace)
RUN pnpm install --frozen-lockfile

# Construir el paquete común primero
RUN pnpm --filter @agro-project/common build

# Copiar el código fuente del gateway
COPY apps/gateway apps/gateway

# Cambiar al directorio del gateway
WORKDIR /app/apps/gateway

# Compilar la aplicación
RUN pnpm run build

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["pnpm", "run", "start:prod"]
