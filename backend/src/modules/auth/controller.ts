import type { Request, Response } from 'express';

import { sendSuccess } from '../../shared/api/sendSuccess';

import * as service from './service';

export async function login(req: Request, res: Response): Promise<void> {
    const data = await service.login(req.body.login, req.body.password);

    sendSuccess(res, 200, data);
}

export async function me(req: Request, res: Response): Promise<void> {
    sendSuccess(res, 200, await service.me(req.userId!));
}
