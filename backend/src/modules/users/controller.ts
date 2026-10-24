import type { Request, Response } from 'express';

import { sendSuccess } from '../../shared/api/sendSuccess';

import * as service from './service';

export async function list(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, 200, await service.listUsers());
}

export async function create(req: Request, res: Response): Promise<void> {
    const user = await service.createUser(req.body.login, req.body.password);

    sendSuccess(res, 201, user);
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };

    await service.resetPassword(id, req.body.password);
    sendSuccess(res, 200, null);
}

export async function remove(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };

    await service.removeUser(id, req.userId!);
    sendSuccess(res, 200, null);
}
