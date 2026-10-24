import type { Pool } from 'pg';

import type { IFine, IFineInput, IFineRow } from './types';

let db: Pool | null = null;

export function initFinesRepository(pool: Pool): void {
    db = pool;
}

function conn(): Pool {
    if (!db) {
        throw new Error('fines repository не инициализирован (initFinesRepository)');
    }

    return db;
}

function toFine(row: IFineRow): IFine {
    return {
        amount: row.amount,
        article: row.article,
        date: row.date,
        driverId: row.driver_id,
        id: row.id,
        isPaid: row.is_paid,
        vehicleId: row.vehicle_id
    };
}

const RETURNING_SQL = `RETURNING id,
       vehicle_id,
       driver_id,
       to_char(date, 'YYYY-MM-DD') AS date,
       article,
       amount,
       is_paid`;

// все запросы — в рамках учётки-владельца (изоляция данных)
export async function listFines(userId: string): Promise<IFine[]> {
    const { rows } = await conn().query<IFineRow>(`
SELECT id,
       vehicle_id,
       driver_id,
       to_char(date, 'YYYY-MM-DD') AS date,
       article,
       amount,
       is_paid
  FROM fines
 WHERE user_id = $1
 ORDER BY id`,
        [ userId ]);

    return rows.map(toFine);
}

export async function createFine(userId: string, input: IFineInput): Promise<IFine> {
    const { rows } = await conn().query<IFineRow>(
`INSERT INTO fines (user_id, vehicle_id, driver_id, date, article, amount, is_paid)
VALUES ($1, $2, $3, $4, $5, $6, $7)
${RETURNING_SQL}`,
        [ userId, input.vehicleId, input.driverId, input.date, input.article, input.amount, input.isPaid ]
    );

    return toFine(rows[0]);
}

export async function updateFine(
        userId: string,
        id: string,
        input: IFineInput
): Promise<IFine | null> {
    const { rows } = await conn().query<IFineRow>(
`UPDATE fines
   SET vehicle_id = $3,
       driver_id = $4,
       date = $5,
       article = $6,
       amount = $7,
       is_paid = $8
 WHERE id = $2 AND user_id = $1
${RETURNING_SQL}`,
        [ userId, id, input.vehicleId, input.driverId, input.date, input.article, input.amount, input.isPaid ]
    );

    return rows[0] ? toFine(rows[0]) : null;
}

export async function removeFine(userId: string, id: string): Promise<boolean> {
    const { rowCount } = await conn().query(
        'DELETE FROM fines WHERE id = $2 AND user_id = $1',
        [ userId, id ]
    );

    return (rowCount ?? 0) > 0;
}

/** Существует ли ТС у данной учётки (ссылки штрафа не выходят за владельца). */
export async function vehicleExists(id: string, userId: string): Promise<boolean> {
    const { rows } = await conn().query<{ exists: boolean; }>(
        'SELECT EXISTS (SELECT 1 FROM vehicles WHERE id = $1 AND user_id = $2) AS exists',
        [ id, userId ]
    );

    return rows[0].exists;
}

/** Существует ли водитель у данной учётки. */
export async function driverExists(id: string, userId: string): Promise<boolean> {
    const { rows } = await conn().query<{ exists: boolean; }>(
        'SELECT EXISTS (SELECT 1 FROM drivers WHERE id = $1 AND user_id = $2) AS exists',
        [ id, userId ]
    );

    return rows[0].exists;
}
