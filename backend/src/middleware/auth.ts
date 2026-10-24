import type { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ErrorCode } from '../errors/ErrorCode';
import { findUserById } from '../modules/auth/repository';
import type { UserRole } from '../modules/auth/types';
import { type IJwtPayload, TokenExpiredError, verifyToken } from '../services/jwt';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {

        // расширяем интерфейс Express — переименовывать нельзя
        // eslint-disable-next-line @typescript-eslint/naming-convention
        interface Request {
            userId?: string;
            userRole?: UserRole;
        }
    }
}

/** Bearer JWT → req.userId + req.userRole (роль — из БД, не из токена). */
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

        const user = await findUserById(payload.sub);

        if (!user) {
            throw new ApiError(401, ErrorCode.Unauthorized, 'Пользователь не найден');
        }

        req.userId = user.id;
        req.userRole = user.role;
        next();
    } catch (err) {
        next(err);
    }
}

/** Только админу; ставится после authMiddleware. */
export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
    if (req.userRole !== 'admin') {
        next(new ApiError(403, ErrorCode.Forbidden, 'Доступ только для администратора'));

        return;
    }
    next();
}
