import type { Pool } from 'pg';

import type { IVehicle, IVehicleInput, IVehicleRow } from './types';

let db: Pool | null = null;

export function initVehiclesRepository(pool: Pool): void {
    db = pool;
}

function conn(): Pool {
    if (!db) {
        throw new Error('vehicles repository не инициализирован (initVehiclesRepository)');
    }

    return db;
}

function toVehicle(row: IVehicleRow): IVehicle {
    return {
        id: row.id,
        make: row.make,
        mileage: row.mileage,
        model: row.model,
        plate: row.plate,
        status: row.status,
        vehicleType: row.vehicle_type,
        year: row.year
    };
}

const SELECT_SQL = `
SELECT id,
       plate,
       make,
       model,
       vehicle_type,
       year,
       mileage,
       status
  FROM vehicles
 WHERE user_id = $1
 ORDER BY id`;

// все запросы — в рамках учётки-владельца (изоляция данных)
export async function listVehicles(userId: string): Promise<IVehicle[]> {
    const { rows } = await conn().query<IVehicleRow>(SELECT_SQL, [ userId ]);

    return rows.map(toVehicle);
}

export async function createVehicle(userId: string, input: IVehicleInput): Promise<IVehicle> {
    const { rows } = await conn().query<IVehicleRow>(
`INSERT INTO vehicles (user_id, plate, make, model, vehicle_type, year, mileage, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id, plate, make, model, vehicle_type, year, mileage, status`,
        [
            userId,
            input.plate,
            input.make,
            input.model,
            input.vehicleType,
            input.year,
            input.mileage,
            input.status
        ]
    );

    return toVehicle(rows[0]);
}

export async function updateVehicle(
        userId: string,
        id: string,
        input: IVehicleInput
): Promise<IVehicle | null> {
    const { rows } = await conn().query<IVehicleRow>(
`UPDATE vehicles
   SET plate = $3,
       make = $4,
       model = $5,
       vehicle_type = $6,
       year = $7,
       mileage = $8,
       status = $9
 WHERE id = $2 AND user_id = $1
RETURNING id, plate, make, model, vehicle_type, year, mileage, status`,
        [
            userId,
            id,
            input.plate,
            input.make,
            input.model,
            input.vehicleType,
            input.year,
            input.mileage,
            input.status
        ]
    );

    return rows[0] ? toVehicle(rows[0]) : null;
}

export async function removeVehicle(userId: string, id: string): Promise<boolean> {
    const { rowCount } = await conn().query(
        'DELETE FROM vehicles WHERE id = $2 AND user_id = $1',
        [ userId, id ]
    );

    return (rowCount ?? 0) > 0;
}

/** Есть ли штрафы или бронирования, ссылающиеся на ТС. */
export async function vehicleHasDependencies(id: string): Promise<boolean> {
    // без фильтра учётки: штрафы/брони ссылаются только на свои ТС
    const { rows } = await conn().query<{ exists: boolean; }>(
`SELECT EXISTS (
    SELECT 1 FROM fines WHERE vehicle_id = $1
    UNION ALL
    SELECT 1 FROM bookings WHERE vehicle_id = $1
) AS exists`,
        [ id ]
    );

    return rows[0].exists;
}
