import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { NIL_UUID } from '../src/modules/bookings/service';

import {
    app,
    bookingPayload,
    createPrereqs,
    driverPayload,
    finePayload,
    resetDb,
    vehiclePayload
} from './helpers';

beforeEach(async () => {
    await resetDb();
});

describe('бизнес-правила: удаление с зависимостями', () => {
    it('водителя со штрафом удалить нельзя — 409', async () => {
        const { driverId, vehicleId } = await createPrereqs();

        await request(app).post('/v1/fines')
.send(finePayload(vehicleId, driverId));

        const res = await request(app).delete(`/v1/drivers/${driverId}`);

        expect(res.status).toBe(409);
        expect(res.body.error.message)
            .toBe('Нельзя удалить водителя: есть связанные штрафы или бронирования');
    });

    it('ТС с бронью удалить нельзя — 409', async () => {
        const { driverId, vehicleId } = await createPrereqs();

        await request(app).post('/v1/bookings')
.send(bookingPayload(vehicleId, driverId));

        const res = await request(app).delete(`/v1/vehicles/${vehicleId}`);

        expect(res.status).toBe(409);
        expect(res.body.error.message)
            .toBe('Нельзя удалить ТС: есть связанные штрафы или бронирования');
    });

    it('без зависимостей удаление проходит — 200', async () => {
        const { driverId } = await createPrereqs();

        const res = await request(app).delete(`/v1/drivers/${driverId}`);

        expect(res.status).toBe(200);
    });
});

describe('бизнес-правила: уникальность', () => {
    it('дубликат номера прав — 409', async () => {
        const payload = driverPayload({ licenseNumber: '16 99 777777' });

        await request(app).post('/v1/drivers')
.send(payload);
        const res = await request(app).post('/v1/drivers')
.send(payload);

        expect(res.status).toBe(409);
        expect(res.body.error.message).toBe('Водитель с таким номером прав уже существует');
    });

    it('дубликат госномера — 409', async () => {
        const payload = vehiclePayload({ plate: 'Х999ХХ16' });

        await request(app).post('/v1/vehicles')
.send(payload);
        const res = await request(app).post('/v1/vehicles')
.send(payload);

        expect(res.status).toBe(409);
        expect(res.body.error.message).toBe('ТС с таким госномером уже существует');
    });
});

describe('бизнес-правила: штрафы', () => {
    it('несуществующее ТС — 400', async () => {
        const res = await request(app)
            .post('/v1/fines')
            .send(finePayload(NIL_UUID));

        expect(res.status).toBe(400);
        expect(res.body.error.message).toBe('Выбранное ТС не найдено');
    });

    it('несуществующий водитель — 400', async () => {
        const { vehicleId } = await createPrereqs();

        const res = await request(app)
            .post('/v1/fines')
            .send(finePayload(vehicleId, NIL_UUID));

        expect(res.status).toBe(400);
        expect(res.body.error.message).toBe('Выбранный водитель не найден');
    });
});

describe('бизнес-правила: бронирования', () => {
    it('окончание раньше начала — 400', async () => {
        const { driverId, vehicleId } = await createPrereqs();

        const res = await request(app)
            .post('/v1/bookings')
            .send(bookingPayload(vehicleId, driverId, {
                endsAt: '2026-10-25T09:00',
                startsAt: '2026-10-25T10:00'
            }));

        expect(res.status).toBe(400);
        expect(res.body.error.message).toBe('Окончание брони должно быть позже начала');
    });

    it('несуществующий водитель — 400', async () => {
        const { vehicleId } = await createPrereqs();

        const res = await request(app)
            .post('/v1/bookings')
            .send(bookingPayload(vehicleId, NIL_UUID));

        expect(res.status).toBe(400);
        expect(res.body.error.message).toBe('Выбранный водитель не найден');
    });

    it('пересечение периодов одного ТС — 409', async () => {
        const { driverId, vehicleId } = await createPrereqs();

        await request(app)
            .post('/v1/bookings')
            .send(bookingPayload(vehicleId, driverId));

        const res = await request(app)
            .post('/v1/bookings')
            .send(bookingPayload(vehicleId, driverId, {
                endsAt: '2026-10-25T13:00',
                startsAt: '2026-10-25T11:00'
            }));

        expect(res.status).toBe(409);
        expect(res.body.error.message).toBe('Это ТС уже забронировано на указанный период');
    });

    it('отменённая бронь пересечению не мешает — 201', async () => {
        const { driverId, vehicleId } = await createPrereqs();

        await request(app)
            .post('/v1/bookings')
            .send(bookingPayload(vehicleId, driverId, { status: 'cancelled' }));

        const res = await request(app)
            .post('/v1/bookings')
            .send(bookingPayload(vehicleId, driverId));

        expect(res.status).toBe(201);
    });

    it('изменение брони на её же период проходит (самоисключение)', async () => {
        const { driverId, vehicleId } = await createPrereqs();
        const created = await request(app)
            .post('/v1/bookings')
            .send(bookingPayload(vehicleId, driverId));

        const res = await request(app)
            .put(`/v1/bookings/${created.body.data.id}`)
            .send(bookingPayload(vehicleId, driverId, { purpose: 'Та же бронь, новая цель' }));

        expect(res.status).toBe(200);
        expect(res.body.data.purpose).toBe('Та же бронь, новая цель');
    });
});

describe('ошибки запросов', () => {
    it('неизвестный id — 404', async () => {
        const res = await request(app)
            .put(`/v1/drivers/${NIL_UUID}`)
            .send(driverPayload());

        expect(res.status).toBe(404);
        expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('некорректное тело — 400 VALIDATION_ERROR', async () => {
        const res = await request(app)
            .post('/v1/vehicles')
            .send(vehiclePayload({ year: 1800 }));

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('некорректный формат даты брони — 400', async () => {
        const res = await request(app)
            .post('/v1/bookings')
            .send(bookingPayload(NIL_UUID, NIL_UUID, { startsAt: '25.10.2026 10:00' }));

        expect(res.status).toBe(400);
    });
});
