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

export async function listFines(): Promise<IFine[]> {
    const { rows } = await conn().query<IFineRow>(`
SELECT id,
       vehicle_id,
       driver_id,
       to_char(date, 'YYYY-MM-DD') AS date,
       article,
       amount,
       is_paid
  FROM fines
 ORDER BY id`);

    return rows.map(toFine);
}

export async function createFine(input: IFineInput): Promise<IFine> {
    const { rows } = await conn().query<IFineRow>(
`INSERT INTO fines (vehicle_id, driver_id, date, article, amount, is_paid)
VALUES ($1, $2, $3, $4, $5, $6)
${RETURNING_SQL}`,
        [ input.vehicleId, input.driverId, input.date, input.article, input.amount, input.isPaid ]
    );

    return toFine(rows[0]);
}

export async function updateFine(id: string, input: IFineInput): Promise<IFine | null> {
    const { rows } = await conn().query<IFineRow>(
`UPDATE fines
   SET vehicle_id = $2,
       driver_id = $3,
       date = $4,
       article = $5,
       amount = $6,
       is_paid = $7
 WHERE id = $1
${RETURNING_SQL}`,
        [ id, input.vehicleId, input.driverId, input.date, input.article, input.amount, input.isPaid ]
    );

    return rows[0] ? toFine(rows[0]) : null;
}

export async function removeFine(id: string): Promise<boolean> {
    const { rowCount } = await conn().query(
        'DELETE FROM fines WHERE id = $1',
        [ id ]
    );

    return (rowCount ?? 0) > 0;
}

/** Существует ли ТС (проверка ссылки при создании/изменении штрафа). */
export async function vehicleExists(id: string): Promise<boolean> {
    const { rows } = await conn().query<{ exists: boolean; }>(
        'SELECT EXISTS (SELECT 1 FROM vehicles WHERE id = $1) AS exists',
        [ id ]
    );

    return rows[0].exists;
}

/** Существует ли водитель. */
export async function driverExists(id: string): Promise<boolean> {
    const { rows } = await conn().query<{ exists: boolean; }>(
        'SELECT EXISTS (SELECT 1 FROM drivers WHERE id = $1) AS exists',
        [ id ]
    );

    return rows[0].exists;
}
