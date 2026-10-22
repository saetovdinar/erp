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
 ORDER BY id`;

export async function listVehicles(): Promise<IVehicle[]> {
    const { rows } = await conn().query<IVehicleRow>(SELECT_SQL);

    return rows.map(toVehicle);
}

export async function createVehicle(input: IVehicleInput): Promise<IVehicle> {
    const { rows } = await conn().query<IVehicleRow>(
`INSERT INTO vehicles (plate, make, model, vehicle_type, year, mileage, status)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id, plate, make, model, vehicle_type, year, mileage, status`,
        [
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

export async function updateVehicle(id: string, input: IVehicleInput): Promise<IVehicle | null> {
    const { rows } = await conn().query<IVehicleRow>(
`UPDATE vehicles
   SET plate = $2,
       make = $3,
       model = $4,
       vehicle_type = $5,
       year = $6,
       mileage = $7,
       status = $8
 WHERE id = $1
RETURNING id, plate, make, model, vehicle_type, year, mileage, status`,
        [
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

export async function removeVehicle(id: string): Promise<boolean> {
    const { rowCount } = await conn().query(
        'DELETE FROM vehicles WHERE id = $1',
        [ id ]
    );

    return (rowCount ?? 0) > 0;
}

/** Есть ли штрафы или бронирования, ссылающиеся на ТС. */
export async function vehicleHasDependencies(id: string): Promise<boolean> {
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
