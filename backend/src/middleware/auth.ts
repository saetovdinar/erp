import type { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ErrorCode } from '../errors/ErrorCode';
import { findUserById } from '../modules/auth/repository';
import { type IJwtPayload, TokenExpiredError, verifyToken } from '../services/jwt';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {

        // расширяем интерфейс Express — переименовывать нельзя
        // eslint-disable-next-line @typescript-eslint/naming-convention
        interface Request {
            userId?: string;
        }
    }
}

/** Bearer JWT → req.userId (+ проверка, что пользователь жив). */
export async function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
        const header = req.headers.authorization ?? '';
        const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

        if (!token) {
            throw new ApiError(401, ErrorCode.Unauthorized, 'Нужен Authorization: Bearer <token>');
        }

        let payload: IJwtPayload;

        try {
            payload = verifyToken(token);
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new ApiError(401, ErrorCode.TokenExpired, 'Срок действия токена истёк');
            }
            throw new ApiError(401, ErrorCode.InvalidToken, 'Невалидный токен');
        }

        if (payload.role !== 'admin') {
            throw new ApiError(401, ErrorCode.InvalidToken, 'Некорректная роль в токене');
        }

        const user = await findUserById(payload.sub);

        if (!user) {
            throw new ApiError(401, ErrorCode.Unauthorized, 'Пользователь не найден');
        }

        req.userId = user.id;
        next();
    } catch (err) {
        next(err);
    }
}
