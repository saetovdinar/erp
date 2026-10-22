# erp — система мониторинга такси

Монорепо (npm workspaces): **backend** — Express 5 + PostgreSQL (паттерн
`taxi/backend`), **frontend** — React 19 + webpack (как в mint-client).
Правила кода и структура — см. [docs/RULES.md](docs/RULES.md).

Сейчас это каркас: рабочий модуль `health` (эталон полного паттерна
`routes → controller → service → repository`), заглушка фронта с пингом API.
Функциональный состав мониторинга проектируется отдельно.

## Быстрый старт

```bash
nvm use          # Node 22
npm install

# PostgreSQL (docker) — или свой, тогда DATABASE_URL в backend/.env
cd backend && docker compose up -d postgres && cd ..

npm run dev      # API → http://127.0.0.1:5100, фронт → http://127.0.0.1:5173
```

Проверка: `curl http://127.0.0.1:5100/v1/health` — конверт
`{ success: true, data: { status: 'ok', db: 'up' | 'down', time } }`
(API стартует и без БД; `db: down` — БД недоступна).

Образец окружения — `backend/.env.example` (скопировать в `backend/.env`).

## Команды

| Команда (из корня) | Что делает |
|---|---|
| `npm run dev` | backend (ts-node-dev, :5100) + frontend (webpack serve, :5173, прокси `/v1`) |
| `npm run build` | сборка обоих воркспейсов |
| `npm run typecheck` | `tsc --noEmit` в обоих воркспейсах |
| `npm run lint` / `lint:fix` | ESLint 9 (правила mint-client) |
| `npm test` | vitest (backend) |
| `npm run db:setup -w backend` | применить `src/db/schema.sql` отдельно |

## Структура

```
erp/
  backend/                 # Express 5 + pg (сырой SQL) + zod — паттерн taxi/backend
    src/
      app.ts               # createApp(): cors, json, rateLimit, /v1-роуты, 404, errorHandler
      server.ts            # http + миграция схемы + graceful shutdown (стартует и без БД)
      config.ts            # env с дефолтами
      errors/              # ApiError, ErrorCode
      middleware/          # validate (zod), errors, rateLimit
      shared/api/          # конверт {success,data} / {success,error}
      utils/               # db (pg Pool), logger
      modules/health/      # эталон модуля: routes → controller → service → repository
      db/                  # schema.sql, setup.ts
    tests/                 # vitest + supertest
    Dockerfile, docker-compose.yml (postgres:16 + api)
  frontend/                # React 19 + TypeScript, сборка webpack + babel (как mint-client)
    src/                   # App (пинг /v1/health), api/client (конверт), styles
  docs/RULES.md            # все конвенции проекта
  eslint.config.js         # правила @jitsi/eslint-config 6.0.4 (копия, ESLint 9 flat)
```
