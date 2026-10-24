import bcrypt from 'bcryptjs';

import { closePool, getPool } from '../utils/db';
import { logger } from '../utils/logger';

// Демо-данные (перенесены из моков фронта). UUID фиксированные: вставка
// идемпотентна (ON CONFLICT DO NOTHING), порядок выборки — по id.

interface IDriverSeed {
    experienceYears: number;
    fullName: string;
    hiredAt: string;
    id: string;
    licenseNumber: string;
    phone: string;
    status: string;
}

interface IVehicleSeed {
    id: string;
    make: string;
    mileage: number;
    model: string;
    plate: string;
    status: string;
    vehicleType: string;
    year: number;
}

interface IFineSeed {
    amount: number;
    article: string;
    date: string;
    driverId: string | null;
    id: string;
    isPaid: boolean;
    vehicleId: string;
}

interface IBookingSeed {
    driverId: string;
    endsAt: string;
    id: string;
    purpose: string;
    startsAt: string;
    status: string;
    vehicleId: string;
}

const D1 = '00000000-0000-4000-8000-000000000001';
const D2 = '00000000-0000-4000-8000-000000000002';
const D3 = '00000000-0000-4000-8000-000000000003';
const D4 = '00000000-0000-4000-8000-000000000004';
const D5 = '00000000-0000-4000-8000-000000000005';
const V1 = '00000000-0000-4000-8000-000000000101';
const V2 = '00000000-0000-4000-8000-000000000102';
const V3 = '00000000-0000-4000-8000-000000000103';
const V4 = '00000000-0000-4000-8000-000000000104';
const V5 = '00000000-0000-4000-8000-000000000105';
const ADMIN_ID = '00000000-0000-4000-8000-000000000901';

/** Локальная дата-время 'YYYY-MM-DDTHH:mm' со сдвигом в часах от «сейчас». */
function localDateTime(hoursFromNow: number): string {
    const d = new Date(Date.now() + (hoursFromNow * 3_600_000));

    return new Date(d.getTime() - (d.getTimezoneOffset() * 60_000)).toISOString()
        .slice(0, 16);
}

const driversSeed: IDriverSeed[] = [
    {
        experienceYears: 8,
        fullName: 'Смирнов Алексей Иванович',
        hiredAt: '2018-05-14',
        id: D1,
        licenseNumber: '16 22 123456',
        phone: '+7 917 200-11-22',
        status: 'active'
    },
    {
        experienceYears: 12,
        fullName: 'Гараев Марат Ринатович',
        hiredAt: '2016-02-01',
        id: D2,
        licenseNumber: '16 24 654321',
        phone: '+7 917 311-45-67',
        status: 'active'
    },
    {
        experienceYears: 5,
        fullName: 'Петров Иван Сергеевич',
        hiredAt: '2021-09-06',
        id: D3,
        licenseNumber: '16 27 112233',
        phone: '+7 987 400-78-90',
        status: 'vacation'
    },
    {
        experienceYears: 3,
        fullName: 'Козлов Дмитрий Павлович',
        hiredAt: '2022-11-21',
        id: D4,
        licenseNumber: '16 29 445566',
        phone: '+7 950 123-98-76',
        status: 'fired'
    },
    {
        experienceYears: 15,
        fullName: 'Хасанов Динар Ильдарович',
        hiredAt: '2013-04-15',
        id: D5,
        licenseNumber: '16 19 787878',
        phone: '+7 917 555-31-41',
        status: 'active'
    }
];

const vehiclesSeed: IVehicleSeed[] = [
    {
        id: V1,
        make: 'Ford',
        mileage: 84_500,
        model: 'Focus',
        plate: 'А123ВС16',
        status: 'active',
        vehicleType: 'sedan',
        year: 2021
    },
    {
        id: V2,
        make: 'Toyota',
        mileage: 12_000,
        model: 'Camry',
        plate: 'Е456НК16',
        status: 'active',
        vehicleType: 'sedan',
        year: 2023
    },
    {
        id: V3,
        make: 'Mercedes-Benz',
        mileage: 67_000,
        model: 'V-Class',
        plate: 'К789ОП16',
        status: 'maintenance',
        vehicleType: 'minivan',
        year: 2022
    },
    {
        id: V4,
        make: 'Kia',
        mileage: 152_300,
        model: 'Rio',
        plate: 'М021РТ16',
        status: 'active',
        vehicleType: 'sedan',
        year: 2019
    },
    {
        id: V5,
        make: 'Lada',
        mileage: 210_500,
        model: 'Largus',
        plate: 'У404НХ16',
        status: 'retired',
        vehicleType: 'wagon',
        year: 2017
    }
];

const finesSeed: IFineSeed[] = [
    {
        amount: 500,
        article: '12.9 ч.2 — превышение на 20–40 км/ч',
        date: '2026-09-30',
        driverId: D1,
        id: '00000000-0000-4000-8000-000000000201',
        isPaid: true,
        vehicleId: V1
    },
    {
        amount: 1_000,
        article: '12.16 — проезд на запрещающий сигнал',
        date: '2026-10-05',
        driverId: D5,
        id: '00000000-0000-4000-8000-000000000202',
        isPaid: false,
        vehicleId: V4
    },
    {
        amount: 500,
        article: '12.2 — нечитаемые номера',
        date: '2026-08-21',
        driverId: null,
        id: '00000000-0000-4000-8000-000000000203',
        isPaid: true,
        vehicleId: V3
    },
    {
        amount: 1_500,
        article: '12.9 ч.3 — превышение на 40–60 км/ч',
        date: '2026-10-12',
        driverId: D2,
        id: '00000000-0000-4000-8000-000000000204',
        isPaid: false,
        vehicleId: V2
    }
];

const bookingsSeed: IBookingSeed[] = [
    {
        driverId: D1,
        endsAt: localDateTime(48),
        id: '00000000-0000-4000-8000-000000000301',
        purpose: 'Смена в аэропорт',
        startsAt: localDateTime(-24),
        status: 'active',
        vehicleId: V1
    },
    {
        driverId: D2,
        endsAt: localDateTime(96),
        id: '00000000-0000-4000-8000-000000000302',
        purpose: 'Корпоративный заказ, весь день',
        startsAt: localDateTime(72),
        status: 'planned',
        vehicleId: V2
    },
    {
        driverId: D5,
        endsAt: localDateTime(-48),
        id: '00000000-0000-4000-8000-000000000303',
        purpose: 'Доставка документов',
        startsAt: localDateTime(-96),
        status: 'completed',
        vehicleId: V4
    },
    {
        driverId: D3,
        endsAt: localDateTime(-72),
        id: '00000000-0000-4000-8000-000000000304',
        purpose: 'Отменено клиентом',
        startsAt: localDateTime(-120),
        status: 'cancelled',
        vehicleId: V1
    },
    {
        driverId: D5,
        endsAt: localDateTime(240),
        id: '00000000-0000-4000-8000-000000000305',
        purpose: 'Дальняя поездка — Казань → Набережные Челны',
        startsAt: localDateTime(192),
        status: 'planned',
        vehicleId: V4
    }
];

export async function seed(): Promise<void> {
    const pool = getPool();

    // админ — первым: все демо-данные ниже принадлежат ему (user_id).
    // Логин admin, пароль из ADMIN_PASSWORD; при повторном сиде хэш
    // обновляется под текущий env
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

    await pool.query(
`INSERT INTO users (id, login, password_hash, role)
VALUES ($1, 'admin', $2, 'admin')
ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
        [ ADMIN_ID, await bcrypt.hash(adminPassword, 10) ]
    );

    for (const d of driversSeed) {
        await pool.query(
`INSERT INTO drivers (id, user_id, full_name, license_number, phone, experience_years, hired_at, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (id) DO NOTHING`,
            [ d.id, ADMIN_ID, d.fullName, d.licenseNumber, d.phone, d.experienceYears, d.hiredAt, d.status ]
        );
    }

    for (const v of vehiclesSeed) {
        await pool.query(
`INSERT INTO vehicles (id, user_id, plate, make, model, vehicle_type, year, mileage, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (id) DO NOTHING`,
            [ v.id, ADMIN_ID, v.plate, v.make, v.model, v.vehicleType, v.year, v.mileage, v.status ]
        );
    }

    for (const f of finesSeed) {
        await pool.query(
`INSERT INTO fines (id, user_id, vehicle_id, driver_id, date, article, amount, is_paid)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (id) DO NOTHING`,
            [ f.id, ADMIN_ID, f.vehicleId, f.driverId, f.date, f.article, f.amount, f.isPaid ]
        );
    }

    for (const b of bookingsSeed) {
        await pool.query(
`INSERT INTO bookings (id, user_id, vehicle_id, driver_id, starts_at, ends_at, purpose, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (id) DO NOTHING`,
            [ b.id, ADMIN_ID, b.vehicleId, b.driverId, b.startsAt, b.endsAt, b.purpose, b.status ]
        );
    }
}


if (require.main === module) {
    seed()
        .then(() => {
            logger.info('Демо-данные вставлены');

            return closePool();
        })
        .then(() => process.exit(0))
        .catch((err: unknown) => {
            logger.error('Ошибка db:seed:', err);
            process.exit(1);
        });
}
