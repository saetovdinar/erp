import type { Pool } from 'pg';

import type { IUserAccount, IUserAccountRow } from './types';

let db: Pool | null = null;

export function initUsersRepository(pool: Pool): void {
    db = pool;
}

function conn(): Pool {
    if (!db) {
        throw new Error('users repository не инициализирован (initUsersRepository)');
    }

    return db;
}

function toAccount(row: IUserAccountRow): IUserAccount {
    return {
        createdAt: row.created_at,
        id: row.id,
        login: row.login,
        role: row.role
    };
}

// created_at — строкой сразу в SQL (для таблицы фронта)
const RETURNING_SQL = `RETURNING id,
       login,
       role,
       to_char(created_at, 'YYYY-MM-DD HH24:MI') AS created_at`;

export async function listUsers(): Promise<IUserAccount[]> {
    const { rows } = await conn().query<IUserAccountRow>(`
SELECT id,
       login,
       role,
       to_char(created_at, 'YYYY-MM-DD HH24:MI') AS created_at
  FROM users
 ORDER BY created_at, id`);

    return rows.map(toAccount);
}

export async function createUser(login: string, passwordHash: string): Promise<IUserAccount> {
    const { rows } = await conn().query<IUserAccountRow>(
`INSERT INTO users (login, password_hash, role)
VALUES ($1, $2, 'user')
${RETURNING_SQL}`,
        [ login, passwordHash ]
    );

    return toAccount(rows[0]);
}

export async function updateUserPassword(id: string, passwordHash: string): Promise<boolean> {
    const { rowCount } = await conn().query(
        'UPDATE users SET password_hash = $2 WHERE id = $1',
        [ id, passwordHash ]
    );

    return (rowCount ?? 0) > 0;
}

/**
 * Данные учётки перед удалением: штрафы/брони раньше ТС и водителей —
 * иначе сработает RESTRICT по ссылкам vehicle_id/driver_id.
 */
export async function removeUserData(id: string): Promise<void> {
    await conn().query('DELETE FROM fines WHERE user_id = $1', [ id ]);
    await conn().query('DELETE FROM bookings WHERE user_id = $1', [ id ]);
    await conn().query('DELETE FROM drivers WHERE user_id = $1', [ id ]);
    await conn().query('DELETE FROM vehicles WHERE user_id = $1', [ id ]);
}

export async function removeUser(id: string): Promise<boolean> {
    const { rowCount } = await conn().query(
        'DELETE FROM users WHERE id = $1',
        [ id ]
    );

    return (rowCount ?? 0) > 0;
}
