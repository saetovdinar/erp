import type { NextFunction, Request, Response } from 'express';

import { config } from '../config';
import { ApiError } from '../errors/ApiError';
import { ErrorCode } from '../errors/ErrorCode';

const WINDOW_MS = 60_000;

interface IBucket {
    count: number;
    resetAt: number;
}

const buckets = new Map<string, IBucket>();

/** Простой in-memory лимит запросов с одного IP (окно 1 минута, лимит RATE_LIMIT). */
export function rateLimitMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const key = req.ip ?? 'unknown';
    const now = Date.now();

    let bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        bucket = { count: 0,
            resetAt: now + WINDOW_MS };
        buckets.set(key, bucket);
        if (buckets.size > 10_000) {
            for (const [ k, b ] of buckets) {
                if (b.resetAt <= now) {
                    buckets.delete(k);
                }
            }
        }
    }
    bucket.count += 1;
    if (bucket.count > config.rateLimit) {
        next(new ApiError(429, ErrorCode.RateLimited, 'Слишком много запросов, попробуйте позже'));

        return;
    }
    next();
}
