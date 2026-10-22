import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';

import { createApp } from '../src/app';
import { closePool } from '../src/utils/db';

const app = createApp();

afterAll(async () => {
    await closePool();
});

describe('GET /v1/health', () => {
    it('отвечает 200 конвертом success/data', async () => {
        const res = await request(app).get('/v1/health');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('ok');
    });

    it('неизвестный путь — 404 конвертом success/error', async () => {
        const res = await request(app).get('/v1/nope');

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('NOT_FOUND');
    });
});
