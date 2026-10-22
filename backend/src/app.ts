import cors from 'cors';
import express from 'express';

import { errorHandler, notFoundHandler } from './middleware/errors';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { initHealthRepository } from './modules/health/repository';
import { healthRouter } from './modules/health/routes';
import { getPool } from './utils/db';

// репозитории — на модуле (как в taxi/backend)
const pool = getPool();

initHealthRepository(pool);

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(rateLimitMiddleware);

    app.use('/v1/health', healthRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
