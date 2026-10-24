import type { Pool } from 'pg';

import type { IUserRow } from './types';

let db: Pool | null = null;

export function initAuthRepository(pool: Pool): void {
    db = pool;
}

function conn(): Pool {
    if (!db) {
        throw new Error('auth repository не инициализирован (initAuthRepository)');
    }

    return db;
}

export async function findUserById(id: string): Promise<IUserRow | null> {
    const { rows } = await conn().query<IUserRow>(
        'SELECT id, login, password_hash, role, created_at FROM users WHERE id = $1',
        [ id ]
    );

    return rows[0] ?? null;
}

export async function findUserByLogin(login: string): Promise<IUserRow | null> {
    const { rows } = await conn().query<IUserRow>(
        'SELECT id, login, password_hash, role, created_at FROM users WHERE login = $1',
        [ login ]
    );

    return rows[0] ?? null;
}

export async function updateUserPassword(id: string, passwordHash: string): Promise<void> {
    await conn().query(
        'UPDATE users SET password_hash = $2 WHERE id = $1',
        [ id, passwordHash ]
    );
}
