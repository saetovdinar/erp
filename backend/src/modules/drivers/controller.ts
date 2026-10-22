import type { Request, Response } from 'express';

import { sendSuccess } from '../../shared/api/sendSuccess';

import * as service from './service';
import type { IDriverInput } from './types';

export async function list(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, 200, await service.listDrivers());
}

export async function create(req: Request, res: Response): Promise<void> {
    const driver = await service.createDriver(req.body as IDriverInput);

    sendSuccess(res, 201, driver);
}

export async function update(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };
    const driver = await service.updateDriver(id, req.body as IDriverInput);

    sendSuccess(res, 200, driver);
}

export async function remove(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };

    await service.removeDriver(id);
    sendSuccess(res, 200, null);
}
