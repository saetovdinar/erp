import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { closePool, getPool } from '../utils/db';
import { logger } from '../utils/logger';

/** Схема; идемпотентно — вызывается при старте сервера и из npm run db:setup. */
export async function ensureSchema(): Promise<void> {
    const pool = getPool();
    const schemaPath = join(__dirname, 'schema.sql');

    await pool.query(readFileSync(schemaPath, 'utf8'));
}


if (require.main === module) {
    ensureSchema()
        .then(() => {
            logger.info('Схема применена');

            return closePool();
        })
        .then(() => process.exit(0))
        .catch((err: unknown) => {
            logger.error('Ошибка db:setup:', err);
            process.exit(1);
        });
}
