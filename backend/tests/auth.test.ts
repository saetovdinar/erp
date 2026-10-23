import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { config } from '../src/config';

import {
    ADMIN_LOGIN,
    ADMIN_PASSWORD,
    adminToken,
    app,
    bearer,
    createAdmin,
    resetDb
} from './helpers';

let token = '';

beforeEach(async () => {
    await resetDb();
    await createAdmin();
    token = await adminToken();
});

describe('POST /v1/auth/login', () => {
    it('выдаёт bearer-токен и пользователя', async () => {
        const res = await request(app).post('/v1/auth/login')
.send({ login: ADMIN_LOGIN,
    password: ADMIN_PASSWORD });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.tokenType).toBe('bearer');
        expect(typeof res.body.data.token).toBe('string');
        expect(res.body.data.user).toMatchObject({ login: ADMIN_LOGIN,
            role: 'admin' });
    });

    it('неверный пароль — 401', async () => {
        const res = await request(app).post('/v1/auth/login')
.send({ login: ADMIN_LOGIN,
    password: 'точно-не-пароль' });

        expect(res.status).toBe(401);
        expect(res.body.error.message).toBe('Неверный логин или пароль');
    });

    it('несуществующий логин — тот же ответ, что при неверном пароле', async () => {
        const res = await request(app).post('/v1/auth/login')
.send({ login: 'ghost',
    password: 'что-угодно' });

        expect(res.status).toBe(401);
        expect(res.body.error.message).toBe('Неверный логин или пароль');
    });

    it('пустое тело — 400 VALIDATION_ERROR', async () => {
        const res = await request(app).post('/v1/auth/login')
.send({});

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
});

describe('GET /v1/auth/me', () => {
    it('с токеном возвращает пользователя', async () => {
        const res = await request(app).get('/v1/auth/me')
.set('Authorization', bearer(token));

        expect(res.status).toBe(200);
        expect(res.body.data.login).toBe(ADMIN_LOGIN);
    });

    it('без токена — 401', async () => {
        const res = await request(app).get('/v1/auth/me');

        expect(res.status).toBe(401);
        expect(res.body.error.message).toBe('Нужен Authorization: Bearer <token>');
    });
});

describe('защита дата-эндпоинтов', () => {
    it('без токена — 401', async () => {
        const res = await request(app).get('/v1/drivers');

        expect(res.status).toBe(401);
    });

    it('с токеном — 200', async () => {
        const res = await request(app).get('/v1/drivers')
.set('Authorization', bearer(token));

        expect(res.status).toBe(200);
    });

    it('токен с чужим секретом — 401 INVALID_TOKEN', async () => {
        const forged = jwt.sign({ login: 'admin',
            role: 'admin',
            sub: 'x' }, 'не-тот-секрет');

        const res = await request(app).get('/v1/drivers')
.set('Authorization', bearer(forged));

        expect(res.status).toBe(401);
        expect(res.body.error.code).toBe('INVALID_TOKEN');
    });

    it('просроченный токен — 401 TOKEN_EXPIRED', async () => {
        const expired = jwt.sign(
            { exp: Math.floor(Date.now() / 1000) - 60,
                login: 'admin',
                role: 'admin',
                sub: 'x' },
            config.jwtSecret
        );

        const res = await request(app).get('/v1/drivers')
.set('Authorization', bearer(expired));

        expect(res.status).toBe(401);
        expect(res.body.error.code).toBe('TOKEN_EXPIRED');
    });
});
