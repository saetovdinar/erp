import 'dotenv/config';

function num(name: string, def: number): number {
    const raw = process.env[name];

    if (raw === undefined || raw === '') {
        return def;
    }
    const value = Number(raw);

    return Number.isFinite(value) ? value : def;
}

const jwtSecret = process.env.JWT_SECRET ?? '';

if (!jwtSecret) {
    throw new Error('JWT_SECRET обязателен (сгенерируйте: openssl rand -hex 32). Пример — в .env.example');
}

export const config = {
    env: process.env.NODE_ENV ?? 'development',
    port: num('PORT', 5100),
    databaseUrl: process.env.DATABASE_URL ?? 'postgres://localhost:5432/erp',
    jwtSecret,
    jwtTtlDays: num('JWT_TTL_DAYS', 30),
    rateLimit: num('RATE_LIMIT', 300)
};

export type AppConfig = typeof config;
