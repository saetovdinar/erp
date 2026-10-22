import type { Response } from 'express';

import type { IApiSuccess } from './response';

export function sendSuccess<T>(res: Response, status: number, data: T): void {
    const body: IApiSuccess<T> = { data,
        success: true };

    res.status(status).json(body);
}
