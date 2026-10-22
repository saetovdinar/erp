FROM node:22-alpine

WORKDIR /app

# монорепо: корневой манифест + lock + манифест воркспейса
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
RUN npm ci --workspace backend

COPY backend/tsconfig.json backend/tsconfig.build.json ./backend/
COPY backend/src ./backend/src
RUN npm run build -w backend && npm prune --omit=dev

EXPOSE 5100
CMD ["node", "backend/dist/server.js"]
