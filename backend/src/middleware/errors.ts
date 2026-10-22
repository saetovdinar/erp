import type { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ErrorCode } from '../errors/ErrorCode';
import { sendError } from '../shared/api/sendError';
import { logger } from '../utils/logger';

export function notFoundHandler(req: Request, res: Response): void {
    sendError(res, 404, { code: ErrorCode.NotFound,
        message: `Не найдено: ${req.method} ${req.path}` });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof ApiError) {
        sendError(res, err.status, {
            code: err.code,
            details: err.details,
            message: err.message
        });

        return;
    }
    logger.error('Необработанная ошибка:', err);
    sendError(res, 500, { code: ErrorCode.Internal,
        message: 'Внутренняя ошибка сервера' });
}
