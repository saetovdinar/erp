import { closePool, getPool } from '../utils/db';
import { logger } from '../utils/logger';

/**
 * Готовит базу для тестов: CREATE DATABASE erp_test, если её ещё нет.
 * Запускается из соединения с основной базой (.env → erp); отдельный скрипт
 * (а не vitest globalSetup): импорт pg внутрь globalSetup молча валит раннер.
 */
export async function prepareTestDb(): Promise<void> {
    const pool = getPool();
    const existing = await pool
        .query('SELECT 1 FROM pg_database WHERE datname = $1', [ 'erp_test' ]);

    if ((existing.rowCount ?? 0) === 0) {
        await pool.query('CREATE DATABASE erp_test');
    }
}


if (require.main === module) {
    prepareTestDb()
        .then(() => {
            logger.info('База erp_test готова');

            return closePool();
        })
        .then(() => process.exit(0))
        .catch((err: unknown) => {
            logger.error('Ошибка db:test-prepare:', err);
            process.exit(1);
        });
}
