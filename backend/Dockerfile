FROM node:22-alpine

WORKDIR /app

# монорепо: корневой манифест + lock + .npmrc (legacy-peer-deps) + манифест воркспейса
COPY package.json package-lock.json .npmrc ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN npm ci --workspace backend

COPY tsconfig.base.json ./
COPY backend/tsconfig.json backend/tsconfig.build.json ./backend/
COPY backend/src ./backend/src
RUN npm run build -w backend && npm prune --omit=dev

EXPOSE 5100
CMD ["node", "backend/dist/server.js"]
