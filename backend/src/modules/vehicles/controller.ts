import type { Request, Response } from 'express';

import { sendSuccess } from '../../shared/api/sendSuccess';

import * as service from './service';
import type { IVehicleInput } from './types';

export async function list(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, 200, await service.listVehicles());
}

export async function create(req: Request, res: Response): Promise<void> {
    const vehicle = await service.createVehicle(req.body as IVehicleInput);

    sendSuccess(res, 201, vehicle);
}

export async function update(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };
    const vehicle = await service.updateVehicle(id, req.body as IVehicleInput);

    sendSuccess(res, 200, vehicle);
}

export async function remove(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };

    await service.removeVehicle(id);
    sendSuccess(res, 200, null);
}
