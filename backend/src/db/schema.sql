-- Схема БД системы мониторинга такси. Идемпотентно — применяется при старте
-- сервера (db/setup.ts) и из npm run db:setup.
--
-- Даты и время — локальные строки компании: date 'YYYY-MM-DD',
-- timestamp 'YYYY-MM-DDTHH:mm' (без таймзоны, как в формах фронта).
-- Ссылки с ON DELETE RESTRICT — страховка правила «нельзя удалить запись
-- с зависимостями» (основная проверка — в сервисах модулей).
--
-- Данные изолированы по учёткам: user_id → users. Удаление учётки удаляет
-- все её данные; порядок (штрафы/брони раньше ТС и водителей) — в сервисе
-- users, иначе сработал бы RESTRICT по ссылкам vehicle_id/driver_id.

-- Учётки панели: админ один (сидируется), остальные создаёт админ (role user)
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    login text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS drivers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    license_number text NOT NULL UNIQUE,
    phone text NOT NULL,
    experience_years integer NOT NULL CHECK (experience_years >= 0),
    hired_at date NOT NULL,
    status text NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'fired', 'vacation'))
);

CREATE TABLE IF NOT EXISTS vehicles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plate text NOT NULL UNIQUE,
    make text NOT NULL,
    model text NOT NULL,
    vehicle_type text NOT NULL
        CHECK (vehicle_type IN ('sedan', 'minivan', 'suv', 'wagon')),
    year integer NOT NULL CHECK (year BETWEEN 1950 AND 2100),
    mileage integer NOT NULL CHECK (mileage >= 0),
    status text NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'maintenance', 'retired'))
);

CREATE TABLE IF NOT EXISTS fines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id uuid REFERENCES drivers(id) ON DELETE RESTRICT,
    date date NOT NULL,
    article text NOT NULL,
    amount integer NOT NULL CHECK (amount > 0),
    is_paid boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
    starts_at timestamp NOT NULL,
    ends_at timestamp NOT NULL CHECK (ends_at > starts_at),
    purpose text NOT NULL,
    status text NOT NULL DEFAULT 'planned'
        CHECK (status IN ('planned', 'active', 'completed', 'cancelled'))
);

-- ===== миграции существующих баз (идемпотентно, при каждом старте) =====

-- раньше в CHECK была только роль admin (имя ограничения — автогенерируемое)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'user'));
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';

-- изоляция данных: user_id у таблиц данных; существующие строки отходят админу
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE CASCADE;
UPDATE drivers SET user_id = a.id
  FROM (SELECT id FROM users WHERE login = 'admin' ORDER BY created_at LIMIT 1) a
 WHERE user_id IS NULL;
ALTER TABLE drivers ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE CASCADE;
UPDATE vehicles SET user_id = a.id
  FROM (SELECT id FROM users WHERE login = 'admin' ORDER BY created_at LIMIT 1) a
 WHERE user_id IS NULL;
ALTER TABLE vehicles ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE fines ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE CASCADE;
UPDATE fines SET user_id = a.id
  FROM (SELECT id FROM users WHERE login = 'admin' ORDER BY created_at LIMIT 1) a
 WHERE user_id IS NULL;
ALTER TABLE fines ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE CASCADE;
UPDATE bookings SET user_id = a.id
  FROM (SELECT id FROM users WHERE login = 'admin' ORDER BY created_at LIMIT 1) a
 WHERE user_id IS NULL;
ALTER TABLE bookings ALTER COLUMN user_id SET NOT NULL;
