import type { Request, Response } from 'express';

import { sendSuccess } from '../../shared/api/sendSuccess';

import * as service from './service';
import type { IFineInput } from './types';

export async function list(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, 200, await service.listFines());
}

export async function create(req: Request, res: Response): Promise<void> {
    const fine = await service.createFine(req.body as IFineInput);

    sendSuccess(res, 201, fine);
}

export async function update(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };
    const fine = await service.updateFine(id, req.body as IFineInput);

    sendSuccess(res, 200, fine);
}

export async function remove(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };

    await service.removeFine(id);
    sendSuccess(res, 200, null);
}
