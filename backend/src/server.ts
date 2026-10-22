import http from 'node:http';

import { createApp } from './app';
import { config } from './config';
import { ensureSchema } from './db/setup';
import { closePool } from './utils/db';
import { logger } from './utils/logger';

async function main(): Promise<void> {
    // своя БД может быть ещё не поднята — мониторинг стартует и без неё
    try {
        await ensureSchema();
    } catch (err: unknown) {
        logger.warn('Схема не применена (БД недоступна?) — продолжаю без неё:', err);
    }

    const app = createApp();
    const server = http.createServer(app);

    server.listen(config.port, () => {
        logger.info(`API готов: http://127.0.0.1:${config.port}`);
    });

    const shutdown = async (signal: string): Promise<void> => {
        logger.info(`${signal} — останавливаюсь`);
        server.close();
        await closePool();
        process.exit(0);
    };

    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err: unknown) => {
    logger.error('Фатальная ошибка запуска:', err);
    process.exit(1);
});
