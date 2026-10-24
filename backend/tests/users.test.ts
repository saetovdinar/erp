import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import {
    ADMIN_LOGIN,
    ADMIN_PASSWORD,
    USER_LOGIN,
    USER_PASSWORD,
    adminToken,
    app,
    bearer,
    createAdmin,
    createUserAccount,
    driverPayload,
    resetDb
} from './helpers';

let token = '';

beforeEach(async () => {
    await resetDb();
    await createAdmin();
    token = await adminToken();
});

describe('GET /v1/users', () => {
    it('админ видит список учёток с ролями', async () => {
        await createUserAccount(token);

        const res = await request(app).get('/v1/users')
.set('Authorization', bearer(token));

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.data.map((u: { login: string; }) => u.login))
            .toEqual(expect.arrayContaining([ ADMIN_LOGIN, USER_LOGIN ]));
    });

    it('обычная учётка — 403 FORBIDDEN', async () => {
        const { token: userTok } = await createUserAccount(token);

        const res = await request(app).get('/v1/users')
.set('Authorization', bearer(userTok));

        expect(res.status).toBe(403);
        expect(res.body.error.code).toBe('FORBIDDEN');
    });
});

describe('POST /v1/users', () => {
    it('админ создаёт учётку с ролью user', async () => {
        const res = await request(app).post('/v1/users')
.set('Authorization', bearer(token))
.send({ login: 'petrov',
    password: 'petrov-pass-123' });

        expect(res.status).toBe(201);
        expect(res.body.data).toMatchObject({ login: 'petrov',
            role: 'user' });

        const login = await request(app).post('/v1/auth/login')
.send({ login: 'petrov',
    password: 'petrov-pass-123' });

        expect(login.status).toBe(200);
    });

    it('дубль логина — 409', async () => {
        await createUserAccount(token);

        const res = await request(app).post('/v1/users')
.set('Authorization', bearer(token))
.send({ login: USER_LOGIN,
    password: 'какой-то-пароль-123' });

        expect(res.status).toBe(409);
        expect(res.body.error.message).toBe('Этот логин уже занят');
    });

    it('короткий пароль — 400 VALIDATION_ERROR', async () => {
        const res = await request(app).post('/v1/users')
.set('Authorization', bearer(token))
.send({ login: 'sidorov',
    password: 'short' });

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('обычная учётка создаёт — 403', async () => {
        const { token: userTok } = await createUserAccount(token);

        const res = await request(app).post('/v1/users')
.set('Authorization', bearer(userTok))
.send({ login: 'sidorov',
    password: 'sidorov-pass-123' });

        expect(res.status).toBe(403);
    });
});

describe('PUT /v1/users/:id (сброс пароля)', () => {
    it('админ сбрасывает пароль — вход по новому, по старому — 401', async () => {
        const { id } = await createUserAccount(token);

        const res = await request(app).put(`/v1/users/${id}`)
.set('Authorization', bearer(token))
.send({ password: 'новый-пароль-456' });

        expect(res.status).toBe(200);

        const byOld = await request(app).post('/v1/auth/login')
.send({ login: USER_LOGIN,
    password: USER_PASSWORD });

        expect(byOld.status).toBe(401);

        const byNew = await request(app).post('/v1/auth/login')
.send({ login: USER_LOGIN,
    password: 'новый-пароль-456' });

        expect(byNew.status).toBe(200);
    });

    it('несуществующий id — 404', async () => {
        const res = await request(app)
.put('/v1/users/00000000-0000-0000-0000-000000000000')
.set('Authorization', bearer(token))
.send({ password: 'новый-пароль-456' });

        expect(res.status).toBe(404);
    });
});

describe('DELETE /v1/users/:id', () => {
    it('учётка удаляется вместе со своими данными (каскад)', async () => {
        // у админа — своя запись, у учётки — своя; после удаления учётки
        // у админа остаётся ровно его запись
        await request(app).post('/v1/drivers')
.set('Authorization', bearer(token))
.send(driverPayload({ fullName: 'Админов Админ Админович' }));

        const { id, token: userTok } = await createUserAccount(token);

        await request(app).post('/v1/drivers')
.set('Authorization', bearer(userTok))
.send(driverPayload());

        const res = await request(app).delete(`/v1/users/${id}`)
.set('Authorization', bearer(token));

        expect(res.status).toBe(200);

        const adminDrivers = await request(app).get('/v1/drivers')
.set('Authorization', bearer(token));

        expect(adminDrivers.body.data).toHaveLength(1);
        expect(adminDrivers.body.data[0].fullName).toBe('Админов Админ Админович');

        const login = await request(app).post('/v1/auth/login')
.send({ login: USER_LOGIN,
    password: USER_PASSWORD });

        expect(login.status).toBe(401);
    });

    it('удалить себя — 400', async () => {
        const me = await request(app).get('/v1/auth/me')
.set('Authorization', bearer(token));

        const res = await request(app).delete(`/v1/users/${me.body.data.id}`)
.set('Authorization', bearer(token));

        expect(res.status).toBe(400);
        expect(res.body.error.message).toBe('Нельзя удалить свою учётку');
    });

    it('несуществующий id — 404', async () => {
        const res = await request(app)
.delete('/v1/users/00000000-0000-0000-0000-000000000000')
.set('Authorization', bearer(token));

        expect(res.status).toBe(404);
    });
});

describe('PUT /v1/auth/password', () => {
    it('смена пароля: по новому входит, по старому — 401', async () => {
        const res = await request(app).put('/v1/auth/password')
.set('Authorization', bearer(token))
.send({ currentPassword: ADMIN_PASSWORD,
    newPassword: 'новый-пароль-789' });

        expect(res.status).toBe(200);

        const byOld = await request(app).post('/v1/auth/login')
.send({ login: ADMIN_LOGIN,
    password: ADMIN_PASSWORD });

        expect(byOld.status).toBe(401);

        const byNew = await request(app).post('/v1/auth/login')
.send({ login: ADMIN_LOGIN,
    password: 'новый-пароль-789' });

        expect(byNew.status).toBe(200);
    });

    it('неверный текущий пароль — 401', async () => {
        const res = await request(app).put('/v1/auth/password')
.set('Authorization', bearer(token))
.send({ currentPassword: 'точно-не-пароль',
    newPassword: 'новый-пароль-789' });

        expect(res.status).toBe(401);
        expect(res.body.error.message).toBe('Неверный пароль');
    });

    it('короткий новый пароль — 400', async () => {
        const res = await request(app).put('/v1/auth/password')
.set('Authorization', bearer(token))
.send({ currentPassword: ADMIN_PASSWORD,
    newPassword: 'short' });

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
});
