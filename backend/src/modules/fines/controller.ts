import type { Request, Response } from 'express';

import { sendSuccess } from '../../shared/api/sendSuccess';

import * as service from './service';
import type { IFineInput } from './types';

export async function list(req: Request, res: Response): Promise<void> {
    sendSuccess(res, 200, await service.listFines(req.userId!));
}

export async function create(req: Request, res: Response): Promise<void> {
    const fine = await service.createFine(req.userId!, req.body as IFineInput);

    sendSuccess(res, 201, fine);
}

export async function update(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };
    const fine = await service.updateFine(req.userId!, id, req.body as IFineInput);

    sendSuccess(res, 200, fine);
}

export async function remove(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };

    await service.removeFine(req.userId!, id);
    sendSuccess(res, 200, null);
}
