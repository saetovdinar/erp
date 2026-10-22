import type { Pool } from 'pg';

let db: Pool | null = null;

export function initHealthRepository(pool: Pool): void {
    db = pool;
}

function conn(): Pool {
    if (!db) {
        throw new Error('health repository не инициализирован (initHealthRepository)');
    }

    return db;
}

/** SELECT 1 — жива ли БД. */
export async function pingDb(): Promise<boolean> {
    try {
        await conn().query('SELECT 1');

        return true;
    } catch {
        return false;
    }
}
