import cors from 'cors';
import express from 'express';

import { authMiddleware } from './middleware/auth';
import { errorHandler, notFoundHandler } from './middleware/errors';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { initAuthRepository } from './modules/auth/repository';
import { authRouter } from './modules/auth/routes';
import { initBookingsRepository } from './modules/bookings/repository';
import { bookingsRouter } from './modules/bookings/routes';
import { initDriversRepository } from './modules/drivers/repository';
import { driversRouter } from './modules/drivers/routes';
import { initFinesRepository } from './modules/fines/repository';
import { finesRouter } from './modules/fines/routes';
import { initHealthRepository } from './modules/health/repository';
import { healthRouter } from './modules/health/routes';
import { initVehiclesRepository } from './modules/vehicles/repository';
import { vehiclesRouter } from './modules/vehicles/routes';
import { getPool } from './utils/db';

// репозитории — на модуле (как в taxi/backend)
const pool = getPool();

initAuthRepository(pool);
initBookingsRepository(pool);
initDriversRepository(pool);
initFinesRepository(pool);
initHealthRepository(pool);
initVehiclesRepository(pool);

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(rateLimitMiddleware);

    app.use('/v1/health', healthRouter);
    app.use('/v1/auth', authRouter);

    // данные — только с Bearer-токеном; health и auth открыты
    app.use('/v1/drivers', authMiddleware, driversRouter);
    app.use('/v1/vehicles', authMiddleware, vehiclesRouter);
    app.use('/v1/fines', authMiddleware, finesRouter);
    app.use('/v1/bookings', authMiddleware, bookingsRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
