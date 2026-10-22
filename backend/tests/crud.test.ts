import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

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

describe('CRUD /v1/drivers', () => {
    it('создаёт, изменяет, читает и удаляет водителя', async () => {
        const created = await request(app).post('/v1/drivers')
.send(driverPayload());

        expect(created.status).toBe(201);
        expect(created.body.success).toBe(true);
        expect(created.body.data.id).toBeTruthy();
        expect(created.body.data.hiredAt).toBe('2020-01-15');

        const id = created.body.data.id;
        const updated = await request(app)
            .put(`/v1/drivers/${id}`)
            .send(driverPayload({ fullName: 'Обновлённый Водитель' }));

        expect(updated.status).toBe(200);
        expect(updated.body.data.fullName).toBe('Обновлённый Водитель');

        const listed = await request(app).get('/v1/drivers');

        expect(listed.status).toBe(200);
        expect(listed.body.data).toHaveLength(1);

        const removed = await request(app).delete(`/v1/drivers/${id}`);

        expect(removed.status).toBe(200);
        expect(removed.body.data).toBeNull();

        const after = await request(app).get('/v1/drivers');

        expect(after.body.data).toHaveLength(0);
    });
});

describe('CRUD /v1/vehicles', () => {
    it('создаёт, изменяет, читает и удаляет ТС', async () => {
        const created = await request(app).post('/v1/vehicles')
.send(vehiclePayload());

        expect(created.status).toBe(201);
        expect(created.body.data.year).toBe(2022);

        const id = created.body.data.id;
        const updated = await request(app)
            .put(`/v1/vehicles/${id}`)
            .send(vehiclePayload({ mileage: 20_000 }));

        expect(updated.status).toBe(200);
        expect(updated.body.data.mileage).toBe(20_000);

        const removed = await request(app).delete(`/v1/vehicles/${id}`);

        expect(removed.status).toBe(200);
    });
});

describe('CRUD /v1/fines', () => {
    it('создаёт, изменяет, читает и удаляет штраф', async () => {
        const { driverId, vehicleId } = await createPrereqs();
        const created = await request(app)
            .post('/v1/fines')
            .send(finePayload(vehicleId, driverId));

        expect(created.status).toBe(201);
        expect(created.body.data.date).toBe('2026-10-01');
        expect(created.body.data.driverId).toBe(driverId);

        const id = created.body.data.id;
        const updated = await request(app)
            .put(`/v1/fines/${id}`)
            .send(finePayload(vehicleId, null));

        expect(updated.status).toBe(200);
        expect(updated.body.data.driverId).toBeNull();

        const listed = await request(app).get('/v1/fines');

        expect(listed.body.data).toHaveLength(1);

        const removed = await request(app).delete(`/v1/fines/${id}`);

        expect(removed.status).toBe(200);
    });
});

describe('CRUD /v1/bookings', () => {
    it('создаёт, изменяет, читает и удаляет бронь', async () => {
        const { driverId, vehicleId } = await createPrereqs();
        const created = await request(app)
            .post('/v1/bookings')
            .send(bookingPayload(vehicleId, driverId));

        expect(created.status).toBe(201);
        expect(created.body.data.startsAt).toBe('2026-10-25T10:00');
        expect(created.body.data.endsAt).toBe('2026-10-25T12:00');

        const id = created.body.data.id;
        const updated = await request(app)
            .put(`/v1/bookings/${id}`)
            .send(bookingPayload(vehicleId, driverId, { purpose: 'Обновлённая цель' }));

        expect(updated.status).toBe(200);
        expect(updated.body.data.purpose).toBe('Обновлённая цель');

        const removed = await request(app).delete(`/v1/bookings/${id}`);

        expect(removed.status).toBe(200);
    });
});
