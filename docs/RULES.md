# Правила проекта erp (мониторинг такси)

Единый источник конвенций. Новые правила фиксируются сюда по мере появления.

## Откуда что взято

| Что | Источник |
|---|---|
| Код-стайл и правила ESLint | `mint-client` → `@jitsi/eslint-config` 6.0.4 (+ правка `no-console`); подход как в `taxi/driver_app/.eslintrc.js`: правила скопированы в собственный конфиг без зависимости от пакета |
| Архитектура и структура backend | `taxi/backend` один-в-один (паттерн зафиксирован в `taxi/docs/BACKEND_PLAN.md`) |
| Сборка frontend | webpack 5 + babel (TS через `@babel/preset-typescript`), как в mint-client |
| Конвенции коммитов | AGENTS mint-client: Conventional Commits, английский, обязательный scope |

Форматирование кода едино для всего репо (его проверяет ESLint); архитектурные
паттерны бэкенда — из taxi/backend.

## Монорепо

- npm workspaces: `backend/`, `frontend/`; Node 22 (`.nvmrc`, `node:22-alpine` в Docker).
- Порты: API **5100** (5000 занят taxi-backend), dev-фронт **5173**,
  postgres в docker — **5434**→5432 (5432 локальный, 5433 у taxi).
- Команды из корня: `npm run dev | build | typecheck | lint | lint:fix | test`.
- `.npmrc` с `legacy-peer-deps=true` — как в mint-client (плагины со старыми peer-deps).
- `ajv@8` закреплён в корневых devDeps принудительно: без этого webpack
  (schema-utils → ajv-keywords@5) поднимает ajv@6 и падает на `ajv/dist/compile/codegen`.

## Код-стайл (правила mint-client)

Запуск: `npm run lint` / `npm run lint:fix` (большинство правок `--fix` чинит сам).

Ключевое:

- отступ **4 пробела**, одинарные кавычки, `;`, длина строки ≤ 120;
- интерфейсы — строго `I...` (`IProps`, не `Props`): `@typescript-eslint/naming-convention`;
- `} else {` на одной строке (1tbs);
- импорты отсортированы (внутри строки и между модулями), **пустая строка между
  группами** (external → parent → sibling);
- ключи интерфейсов и значения string-enum — по алфавиту (`typescript-sort-keys`);
- `no-console`: разрешены только `console.error/warn` (обычные логи — `logger.info`,
  он пишет в stdout напрямую);
- arrow: `as-needed` без скобок у одного аргумента; возврат объектного литерала —
  телом-блоком (`x => { return { ... }; }`);
- пустая строка после блока `const`-объявлений и перед `return`;
- максимум 4 параметра функции (`max-params`); не больше 2 уровней вложенных
  колбэков; `no-param-reassign`, `eqeqeq`, `curly` всегда;
- fire-and-forget промисы — через `void promise` (правило `no-void` выключено).

React (frontend):

- хендлеры — `useCallback` с префиксом **`_on`** (`react/jsx-no-bind`,
  `react/jsx-handler-names`); inline-arrow в JSX запрещён;
- JSX: `=` с пробелами (`className = 'app'`), одинарные кавычки в атрибутах,
  `/>` с пробелом (`beforeSelfClosing`), пропсы отсортированы, по одному на строку
  в многострочном теге, первый пропс — с новой строки;
- отступ JSX и пропсов — 4 пробела;
- один компонент на файл (`react/no-multi-comp`).

### Отличия от буквы jitsi-конфига (описаны и в шапке `eslint.config.js`)

- форматтирующие правила ядра → их `@stylistic`-аналоги (в ESLint 9 ядро их
  выпиливает); `camelcase` остался ядерным; `no-spaced-func` → `function-call-spacing`;
- удалённые из ядра правила заменены: `no-negated-in-lhs` → `no-unsafe-negation`,
  `no-native-reassign` → `no-global-assign`; `no-catch-shadow` покрыт `no-shadow`;
- jsdoc-группа выключена (как в `taxi/driver_app/.eslintrc.js`): `valid-jsdoc` /
  `require-jsdoc` удалены из ESLint 9; правило `strict` выключено (модули);
- `react/jsx-first-prop-newline` и `react/require-extension` исключены — их больше
  нет в eslint-plugin-react 7.37;
- `react/react-in-jsx-scope` и `react/jsx-uses-react` выключены — babel
  automatic JSX runtime; `react/prop-types` выключен — типы даёт TypeScript;
- `react/jsx-indent-props` включен со значением 4 (в jitsi для TS выключен) — по
  AGENTS mint-client «отступ 4 пробела».

## Backend-паттерн (taxi/backend)

Стек: Node 22 + TypeScript strict, Express 5, PostgreSQL через `pg` (Pool,
**сырой SQL, без ORM**), zod, ts-node-dev, vitest + supertest. Авторизация
(jsonwebtoken + `middleware/auth`) добавляется по образцу taxi/backend, когда
появится первый защищённый эндпоинт (вместе с `JWT_SECRET` fail-fast в config.ts).

Структура модуля (`modules/<name>/`):

```
routes.ts        # Router, thin: маппинг метод+путь → контроллер (new-cap у Router() — disable)
controller.ts    # приём запроса, sendSuccess/sendError
service.ts       # бизнес-логика
repository.ts    # сырой SQL; init<X>Repository(pool) на модуле + guard conn()
types.ts         # типы модуля (I-префикс)
validators.ts    # zod-схемы для validate()
```

Сквозные правила:

- конверт ответов `{ success: true, data }` / `{ success: false, error: { code,
  message, details? } }` — только через `shared/api/sendSuccess` / `sendError`;
- ошибки — `ApiError(status, code, message, details?)` + `errors/ErrorCode`;
  последний middleware — `errorHandler`, перед ним `notFoundHandler`;
- `app.ts` — `createApp()`: cors, json, rateLimit, `/v1`-роуты, 404, errorHandler;
  репозитории инициализируются на модуле;
- `server.ts` — http-сервер, идемпотентная миграция схемы (`db/setup.ts`),
  graceful shutdown; **стартует и без БД** (система мониторинга), недоступность
  схемы — warn, не краш;
- `config.ts` — env с дефолтами; обязательные секреты — fail-fast;
- тесты — `tests/*.test.ts` (vitest + supertest), `fileParallelism: false`,
  общая тестовая БД `erp_test`; проверки конверта и статусов.

Отличия от taxi/backend (продиктованы линтером):

- `sendError(res, status, { code, details?, message })` — объектом вместо 5
  позиционных параметров (`max-params` = 4);
- `logger.info` пишет через `process.stdout.write` (`no-console` разрешает
  только error/warn);
- форматирование файлов — mint-стиль (4 пробела), содержимое — taxi-паттерн.

## Коммиты

- язык сообщений — всегда английский;
- формат Conventional Commits с обязательным scope: `feat(backend): add driver metrics`;
- типы: `build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test`;
- не коммитить: `.zcode/`, `*.local.md`, `.env`, `dist/`, `coverage/`, логи.

## Рабочий процесс

- План, дизайн и ТЗ — только с явным утверждением пользователя; внутри
  утверждённого плана код/тесты/сборки — без спроса.
- Линт/`tsc` — осознанно (перед коммитом, ревью или по просьбе), не после
  каждой правки.
- При отладке неожиданного поведения — сначала логи, потом гипотезы.
- Новые конвенции — фиксировать в этом файле.
<!-- Да, можно — наш бэкенд к этому почти готов, но у бесплатного Render есть две ловушки, из-за которых я бы БД туда не ставил.

Что с нашим кодом (хорошая новость): всё нужное уже есть. config.ts читает PORT из окружения (Render подставляет свой), DATABASE_URL задаётся переменной окружения, есть GET /v1/health для health-check, а backend/Dockerfile Render умеет собирать напрямую. Более того, server.ts при старте сам вызывает ensureSchema() — таблицы создадутся автоматически при первом запуске. Менять код бэкенда практически не придётся.

Две ловушки бесплатного Render:

Free Postgres живёт 30 дней. Через 30 дней после создания база становится недоступна, пока не оплатишь compute-план. То есть «бесплатно и надолго» на Render получается только сам API, но не БД.
Free web service засыпает через 15 минут без запросов и просыпается около минуты. Для демо терпимо, для постоянного пользования — раздражает.
Рекомендуемая связка: API — на Render free (как Docker-сервис), а БД — на бесплатном Neon (serverless Postgres). Neon по календарю не истекается: ~1 ГБ хранилища на проект, автозасыпание через 5 минут, но пробуждение занимает доли секунды, а не минуту — на фоне засыющего Render-API это вообще незаметно. Альтернативы — Supabase или всё-таки Render Postgres, но с осознанием, что через месяц базу придётся пересоздавать или платить (~$7/мес за минимальный план).

Что осталось бы сделать в репо (небольшой этап):

render.yaml или просто сервис, собранный из backend/Dockerfile, с переменной DATABASE_URL (строка подключения Neon; у Neon SSL — наш pg Pool его поддерживает, надо только проверить параметры);
фронт: сейчас client.ts ходит по относительным путям /v1/... через dev-прокси webpack. Если фронт выкладывать как static site на Render (это бесплатно и не засыпает), нужно добавить настраиваемый базовый URL API — небольшая правка клиента и webpack-конфига;
опционально сид-данные в облако (одноразовой командой или job).
Одно предупреждение: API без авторизации — как только он в интернете, любой сможет создавать/удалять записи. Для демо-стенда нормально, но держите в голове.

Если хотите, подготовлю этот этап — покажу черновик плана (Render + Neon или другой вариант на ваш выбор) и после вашего утверждения сделаю конфиги и правки.

Sources: Render Docs — Deploy for Free, Render — Platforms with a real free tier (2026), Neon Pricing, Neon Docs — Plans, JetAdmin — Neon Pricing 2026 -->