import type { Pool } from 'pg';

import type { IDriver, IDriverInput, IDriverRow } from './types';

let db: Pool | null = null;

export function initDriversRepository(pool: Pool): void {
    db = pool;
}

function conn(): Pool {
    if (!db) {
        throw new Error('drivers repository не инициализирован (initDriversRepository)');
    }

    return db;
}

function toDriver(row: IDriverRow): IDriver {
    return {
        experienceYears: row.experience_years,
        fullName: row.full_name,
        hiredAt: row.hired_at,
        id: row.id,
        licenseNumber: row.license_number,
        phone: row.phone,
        status: row.status
    };
}

const RETURNING_SQL = `RETURNING id,
       full_name,
       license_number,
       phone,
       experience_years,
       to_char(hired_at, 'YYYY-MM-DD') AS hired_at,
       status`;

export async function listDrivers(): Promise<IDriver[]> {
    const { rows } = await conn().query<IDriverRow>(`
SELECT id,
       full_name,
       license_number,
       phone,
       experience_years,
       to_char(hired_at, 'YYYY-MM-DD') AS hired_at,
       status
  FROM drivers
 ORDER BY id`);

    return rows.map(toDriver);
}

export async function createDriver(input: IDriverInput): Promise<IDriver> {
    const { rows } = await conn().query<IDriverRow>(
`INSERT INTO drivers (full_name, license_number, phone, experience_years, hired_at, status)
VALUES ($1, $2, $3, $4, $5, $6)
${RETURNING_SQL}`,
        [
            input.fullName,
            input.licenseNumber,
            input.phone,
            input.experienceYears,
            input.hiredAt,
            input.status
        ]
    );

    return toDriver(rows[0]);
}

export async function updateDriver(id: string, input: IDriverInput): Promise<IDriver | null> {
    const { rows } = await conn().query<IDriverRow>(
`UPDATE drivers
   SET full_name = $2,
       license_number = $3,
       phone = $4,
       experience_years = $5,
       hired_at = $6,
       status = $7
 WHERE id = $1
${RETURNING_SQL}`,
        [
            id,
            input.fullName,
            input.licenseNumber,
            input.phone,
            input.experienceYears,
            input.hiredAt,
            input.status
        ]
    );

    return rows[0] ? toDriver(rows[0]) : null;
}

export async function removeDriver(id: string): Promise<boolean> {
    const { rowCount } = await conn().query(
        'DELETE FROM drivers WHERE id = $1',
        [ id ]
    );

    return (rowCount ?? 0) > 0;
}

/** Есть ли штрафы или бронирования, ссылающиеся на водителя. */
export async function driverHasDependencies(id: string): Promise<boolean> {
    const { rows } = await conn().query<{ exists: boolean; }>(
`SELECT EXISTS (
    SELECT 1 FROM fines WHERE driver_id = $1
    UNION ALL
    SELECT 1 FROM bookings WHERE driver_id = $1
) AS exists`,
        [ id ]
    );

    return rows[0].exists;
}
