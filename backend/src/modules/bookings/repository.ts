import type { Pool } from 'pg';

import type { IBooking, IBookingInput, IBookingRow } from './types';

let db: Pool | null = null;

export function initBookingsRepository(pool: Pool): void {
    db = pool;
}

function conn(): Pool {
    if (!db) {
        throw new Error('bookings repository не инициализирован (initBookingsRepository)');
    }

    return db;
}

function toBooking(row: IBookingRow): IBooking {
    return {
        driverId: row.driver_id,
        endsAt: row.ends_at,
        id: row.id,
        purpose: row.purpose,
        startsAt: row.starts_at,
        status: row.status,
        vehicleId: row.vehicle_id
    };
}

const RETURNING_SQL = `RETURNING id,
       vehicle_id,
       driver_id,
       to_char(starts_at, 'YYYY-MM-DD"T"HH24:MI') AS starts_at,
       to_char(ends_at, 'YYYY-MM-DD"T"HH24:MI') AS ends_at,
       purpose,
       status`;

// все запросы — в рамках учётки-владельца (изоляция данных)
export async function listBookings(userId: string): Promise<IBooking[]> {
    const { rows } = await conn().query<IBookingRow>(`
SELECT id,
       vehicle_id,
       driver_id,
       to_char(starts_at, 'YYYY-MM-DD"T"HH24:MI') AS starts_at,
       to_char(ends_at, 'YYYY-MM-DD"T"HH24:MI') AS ends_at,
       purpose,
       status
  FROM bookings
 WHERE user_id = $1
 ORDER BY id`,
        [ userId ]);

    return rows.map(toBooking);
}

export async function createBooking(userId: string, input: IBookingInput): Promise<IBooking> {
    const { rows } = await conn().query<IBookingRow>(
`INSERT INTO bookings (user_id, vehicle_id, driver_id, starts_at, ends_at, purpose, status)
VALUES ($1, $2, $3, $4, $5, $6, $7)
${RETURNING_SQL}`,
        [ userId, input.vehicleId, input.driverId, input.startsAt, input.endsAt, input.purpose, input.status ]
    );

    return toBooking(rows[0]);
}

export async function updateBooking(
        userId: string,
        id: string,
        input: IBookingInput
): Promise<IBooking | null> {
    const { rows } = await conn().query<IBookingRow>(
`UPDATE bookings
   SET vehicle_id = $3,
       driver_id = $4,
       starts_at = $5,
       ends_at = $6,
       purpose = $7,
       status = $8
 WHERE id = $2 AND user_id = $1
${RETURNING_SQL}`,
        [ userId, id, input.vehicleId, input.driverId, input.startsAt, input.endsAt, input.purpose, input.status ]
    );

    return rows[0] ? toBooking(rows[0]) : null;
}

export async function removeBooking(userId: string, id: string): Promise<boolean> {
    const { rowCount } = await conn().query(
        'DELETE FROM bookings WHERE id = $2 AND user_id = $1',
        [ userId, id ]
    );

    return (rowCount ?? 0) > 0;
}

/** Существует ли ТС у данной учётки (ссылки брони не выходят за владельца). */
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

/**
 * Пересекается ли период с чужой бронью того же ТС (не считая отменённых).
 * selfId исключается при изменении; для создания передаётся nil-uuid.
 * Фильтра по учётке нет: ТС уже принадлежит только этой учётке.
 */
export async function bookingOverlaps(
        input: IBookingInput,
        selfId: string
): Promise<boolean> {
    const { rows } = await conn().query<{ exists: boolean; }>(
`SELECT EXISTS (
    SELECT 1
      FROM bookings
     WHERE vehicle_id = $1
       AND id <> $2
       AND status <> 'cancelled'
       AND starts_at < $4::timestamp
       AND ends_at > $3::timestamp
) AS exists`,
        [ input.vehicleId, selfId, input.startsAt, input.endsAt ]
    );

    return rows[0].exists;
}
