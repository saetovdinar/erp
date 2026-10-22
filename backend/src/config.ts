import 'dotenv/config';

function num(name: string, def: number): number {
    const raw = process.env[name];

    if (raw === undefined || raw === '') {
        return def;
    }
    const value = Number(raw);

    return Number.isFinite(value) ? value : def;
}

// когда появится авторизация — добавить jwtSecret с fail-fast проверкой
// (как JWT_SECRET в taxi/backend: без значения — ошибка запуска)
export const config = {
    env: process.env.NODE_ENV ?? 'development',
    port: num('PORT', 5100),
    databaseUrl: process.env.DATABASE_URL ?? 'postgres://localhost:5432/erp',
    rateLimit: num('RATE_LIMIT', 300)
};

export type AppConfig = typeof config;
