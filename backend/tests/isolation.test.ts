import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import {
    adminToken,
    app,
    bearer,
    bookingPayload,
    createAdmin,
    createPrereqs,
    createUserAccount,
    driverPayload,
    finePayload,
    resetDb,
    vehiclePayload
} from './helpers';

let adminTok = '';
let userTok = '';

beforeEach(async () => {
    await resetDb();
    await createAdmin();
    adminTok = await adminToken();
    userTok = (await createUserAccount(adminTok)).token;
});

describe('изоляция данных учёток', () => {
    it('каждый видит только своих водителей и ТС', async () => {
        await request(app).post('/v1/drivers')
.set('Authorization', bearer(adminTok))
.send(driverPayload({ fullName: 'Админ Водителей' }));
        await request(app).post('/v1/drivers')
.set('Authorization', bearer(userTok))
.send(driverPayload({ fullName: 'Юзер Водителей' }));
        await request(app).post('/v1/vehicles')
.set('Authorization', bearer(adminTok))
.send(vehiclePayload());
        await request(app).post('/v1/vehicles')
.set('Authorization', bearer(userTok))
.send(vehiclePayload());

        const adminDrivers = await request(app).get('/v1/drivers')
.set('Authorization', bearer(adminTok));
        const userDrivers = await request(app).get('/v1/drivers')
.set('Authorization', bearer(userTok));
        const adminVehicles = await request(app).get('/v1/vehicles')
.set('Authorization', bearer(adminTok));
        const userVehicles = await request(app).get('/v1/vehicles')
.set('Authorization', bearer(userTok));

        expect(adminDrivers.body.data).toHaveLength(1);
        expect(adminDrivers.body.data[0].fullName).toBe('Админ Водителей');
        expect(userDrivers.body.data).toHaveLength(1);
        expect(userDrivers.body.data[0].fullName).toBe('Юзер Водителей');
        expect(adminVehicles.body.data).toHaveLength(1);
        expect(userVehicles.body.data).toHaveLength(1);
        expect(adminVehicles.body.data[0].id).not.toBe(userVehicles.body.data[0].id);
    });

    it('чужую запись изменить или удалить нельзя — 404', async () => {
        const created = await request(app).post('/v1/drivers')
.set('Authorization', bearer(adminTok))
.send(driverPayload());

        const id = created.body.data.id;

        const updated = await request(app).put(`/v1/drivers/${id}`)
.set('Authorization', bearer(userTok))
.send(driverPayload({ fullName: 'Взлом Водителей' }));

        expect(updated.status).toBe(404);

        const removed = await request(app).delete(`/v1/drivers/${id}`)
.set('Authorization', bearer(userTok));

        expect(removed.status).toBe(404);

        const adminDrivers = await request(app).get('/v1/drivers')
.set('Authorization', bearer(adminTok));

        expect(adminDrivers.body.data).toHaveLength(1);
        expect(adminDrivers.body.data[0].fullName).not.toBe('Взлом Водителей');
    });

    it('штраф на чужое ТС — 400 «не найдено»', async () => {
        const { vehicleId } = await createPrereqs(adminTok);

        const res = await request(app).post('/v1/fines')
.set('Authorization', bearer(userTok))
.send(finePayload(vehicleId));

        expect(res.status).toBe(400);
        expect(res.body.error.message).toBe('Выбранное ТС не найдено');
    });

    it('бронь на чужие ТС/водителя — 400 «не найдено»', async () => {
        const { driverId, vehicleId } = await createPrereqs(adminTok);

        const res = await request(app).post('/v1/bookings')
.set('Authorization', bearer(userTok))
.send(bookingPayload(vehicleId, driverId));

        expect(res.status).toBe(400);
        expect(res.body.error.message).toBe('Выбранное ТС не найдено');
    });

    it('обычная учётка полноценно работает со своими данными', async () => {
        const driver = await request(app).post('/v1/drivers')
.set('Authorization', bearer(userTok))
.send(driverPayload());
        const vehicle = await request(app).post('/v1/vehicles')
.set('Authorization', bearer(userTok))
.send(vehiclePayload());

        const fine = await request(app).post('/v1/fines')
.set('Authorization', bearer(userTok))
.send(finePayload(vehicle.body.data.id, driver.body.data.id));

        const booking = await request(app).post('/v1/bookings')
.set('Authorization', bearer(userTok))
.send(bookingPayload(vehicle.body.data.id, driver.body.data.id));

        expect(fine.status).toBe(201);
        expect(booking.status).toBe(201);

        const fines = await request(app).get('/v1/fines')
.set('Authorization', bearer(userTok));
        const bookings = await request(app).get('/v1/bookings')
.set('Authorization', bearer(userTok));

        expect(fines.body.data).toHaveLength(1);
        expect(bookings.body.data).toHaveLength(1);
    });
});
