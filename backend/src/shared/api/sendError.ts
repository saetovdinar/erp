import type { Response } from 'express';

import type { IApiFailure } from './response';

export interface ISendErrorBody {
    code: string;
    details?: unknown;
    message: string;
}

export function sendError(res: Response, status: number, error: ISendErrorBody): void {
    const body: IApiFailure = { error: { code: error.code,
        message: error.message },
    success: false };

    if (error.details !== undefined) {
        body.error.details = error.details;
    }
    res.status(status).json(body);
}
