import type { Request, Response } from 'express';

import { sendSuccess } from '../../shared/api/sendSuccess';

import * as service from './service';
import type { IBookingInput } from './types';

export async function list(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, 200, await service.listBookings());
}

export async function create(req: Request, res: Response): Promise<void> {
    const booking = await service.createBooking(req.body as IBookingInput);

    sendSuccess(res, 201, booking);
}

export async function update(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };
    const booking = await service.updateBooking(id, req.body as IBookingInput);

    sendSuccess(res, 200, booking);
}

export async function remove(req: Request, res: Response): Promise<void> {
    const { id } = req.params as unknown as { id: string; };

    await service.removeBooking(id);
    sendSuccess(res, 200, null);
}
