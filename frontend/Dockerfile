# Сборка статики webpack'ом и раздача через nginx (контекст — корень монорепо,
# как в backend/Dockerfile: общий package-lock).
FROM node:22-alpine AS build

WORKDIR /app

# монорепо: корневой манифест + lock + .npmrc (legacy-peer-deps) + манифесты воркспейсов
COPY package.json package-lock.json .npmrc ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN npm ci --workspace frontend

COPY frontend ./frontend
RUN npm run build -w frontend

FROM nginx:1.27-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
