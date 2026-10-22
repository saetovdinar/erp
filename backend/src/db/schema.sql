-- Схема БД системы мониторинга такси. Идемпотентно — применяется при старте
-- сервера (db/setup.ts) и из npm run db:setup.
--
-- Даты и время — локальные строки компании: date 'YYYY-MM-DD',
-- timestamp 'YYYY-MM-DDTHH:mm' (без таймзоны, как в формах фронта).
-- Ссылки с ON DELETE RESTRICT — страховка правила «нельзя удалить запись
-- с зависимостями» (основная проверка — в сервисах модулей).

CREATE TABLE IF NOT EXISTS drivers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
    vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id uuid REFERENCES drivers(id) ON DELETE RESTRICT,
    date date NOT NULL,
    article text NOT NULL,
    amount integer NOT NULL CHECK (amount > 0),
    is_paid boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
    starts_at timestamp NOT NULL,
    ends_at timestamp NOT NULL CHECK (ends_at > starts_at),
    purpose text NOT NULL,
    status text NOT NULL DEFAULT 'planned'
        CHECK (status IN ('planned', 'active', 'completed', 'cancelled'))
);
