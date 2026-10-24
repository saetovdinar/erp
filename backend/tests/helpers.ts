import bcrypt from 'bcryptjs';
import request from 'supertest';

import { createApp } from '../src/app';
import { ensureSchema } from '../src/db/setup';
import type { IBookingInput } from '../src/modules/bookings/types';
import type { IDriverInput } from '../src/modules/drivers/types';
import type { IFineInput } from '../src/modules/fines/types';
import type { IVehicleInput } from '../src/modules/vehicles/types';
import { getPool } from '../src/utils/db';

export const app = createApp();

/** Схема (идемпотентно) + чистые таблицы между тестами (CASCADE разрулит зависимости). */
export async function resetDb(): Promise<void> {
    await ensureSchema();
    await getPool().query('TRUNCATE bookings, fines, vehicles, drivers, users CASCADE');
}

// тестовый админ: логин/пароль фиксированные, хэш считается на месте
export const ADMIN_LOGIN = 'admin';
export const ADMIN_PASSWORD = 'admin-test-123';

export async function createAdmin(): Promise<void> {
    await getPool().query(
        'INSERT INTO users (login, password_hash, role) VALUES ($1, $2, $3)',
        [ ADMIN_LOGIN, bcrypt.hashSync(ADMIN_PASSWORD, 10), 'admin' ]
    );
}

export function bearer(token: string): string {
    return `Bearer ${token}`;
}

/** Вход тестовым админом → JWT для авторизованных запросов. */
export async function adminToken(): Promise<string> {
    const res = await request(app).post('/v1/auth/login')
.send({ login: ADMIN_LOGIN,
    password: ADMIN_PASSWORD });

    if (!res.body?.data?.token) {
        throw new Error(`тестовый админ не смог войти: HTTP ${res.status}`);
    }

    return res.body.data.token as string;
}

// тестовая обычная учётка (создаётся через API от админа)
export const USER_LOGIN = 'ivanov';
export const USER_PASSWORD = 'user-test-123';

/** Создать учётку с ролью user от админа и сразу войти ею → id + токен. */
export async function createUserAccount(
        adminTok: string,
        login = USER_LOGIN,
        password = USER_PASSWORD
): Promise<{ id: string;
            token: string; }> {
    const created = await request(app).post('/v1/users')
.set('Authorization', bearer(adminTok))
.send({ login,
    password });

    if (created.status !== 201) {
        throw new Error(`тестовая учётка не создалась: HTTP ${created.status}`);
    }

    const res = await request(app).post('/v1/auth/login')
.send({ login,
    password });

    if (!res.body?.data?.token) {
        throw new Error(`тестовая учётка не смогла войти: HTTP ${res.status}`);
    }

    return { id: created.body.data.id,
        token: res.body.data.token as string };
}

// детерминированные «уникальные» значения: счётчик вместо random
let seq = 0;

function next(): number {
    seq += 1;

    return seq;
}

export function driverPayload(overrides: Partial<IDriverInput> = {}): IDriverInput {
    return {
        experienceYears: 5,
        fullName: 'Тестов Тест Тестович',
        hiredAt: '2020-01-15',
        licenseNumber: `16 20 ${100000 + next()}`,
        phone: '+7 900 000-00-00',
        status: 'active',
        ...overrides
    };
}

export function vehiclePayload(overrides: Partial<IVehicleInput> = {}): IVehicleInput {
    return {
        make: 'Kia',
        mileage: 10_000,
        model: 'Rio',
        plate: `Т${100 + next()}ТТ16`,
        status: 'active',
        vehicleType: 'sedan',
        year: 2022,
        ...overrides
    };
}

export function finePayload(vehicleId: string, driverId: string | null = null): IFineInput {
    return {
        amount: 500,
        article: '12.9 ч.2 — превышение на 20–40 км/ч',
        date: '2026-10-01',
        driverId,
        isPaid: false,
        vehicleId
    };
}

export function bookingPayload(
        vehicleId: string,
        driverId: string,
        overrides: Partial<IBookingInput> = {}
): IBookingInput {
    return {
        driverId,
        endsAt: '2026-10-25T12:00',
        purpose: 'Тестовая поездка',
        startsAt: '2026-10-25T10:00',
        status: 'planned',
        vehicleId,
        ...overrides
    };
}

/** Создать водителя и ТС и вернуть их id (зависимости для штрафов/броней). */
export async function createPrereqs(token: string): Promise<{ driverId: string;
    vehicleId: string; }> {
    const driver = await request(app).post('/v1/drivers')
.set('Authorization', bearer(token))
.send(driverPayload());
    const vehicle = await request(app).post('/v1/vehicles')
.set('Authorization', bearer(token))
.send(vehiclePayload());

    return { driverId: driver.body.data.id,
        vehicleId: vehicle.body.data.id };
}
