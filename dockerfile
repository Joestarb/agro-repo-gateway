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

# Copiar la configuración base de TypeScript para que los paquetes (schemas, common, etc.)
COPY tsconfig.json ./


# Copiar los paquetes compartidos
COPY packages/common packages/common
COPY packages/schemas packages/schemas

# Copiar el package.json del gateway##
COPY apps/gateway/package.json apps/gateway/

# Instalar dependencias (workspace completo)
RUN pnpm install --frozen-lockfile

# Construir primero los paquetes compartidos
RUN pnpm --filter @agro-project/schemas build
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
CMD ["pnpm", "run", "start:dev"]
