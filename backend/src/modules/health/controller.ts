import type { Request, Response } from 'express';

import { sendSuccess } from '../../shared/api/sendSuccess';

import * as service from './service';

export async function health(_req: Request, res: Response): Promise<void> {
    const status = await service.getHealthStatus();

    sendSuccess(res, 200, status);
}
