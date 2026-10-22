import { ApiError } from '../../errors/ApiError';
import { ErrorCode } from '../../errors/ErrorCode';

import * as repository from './repository';
import type { IBooking, IBookingInput } from './types';

// исключение собственной записи при поиске пересечения на create
export const NIL_UUID = '00000000-0000-0000-0000-000000000000';

export async function listBookings(): Promise<IBooking[]> {
    return await repository.listBookings();
}

export async function createBooking(input: IBookingInput): Promise<IBooking> {
    await assertBookingValid(input, NIL_UUID);

    return repository.createBooking(input);
}

export async function updateBooking(id: string, input: IBookingInput): Promise<IBooking> {
    await assertBookingValid(input, id);

    const booking = await repository.updateBooking(id, input);

    if (!booking) {
        throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
    }

    return booking;
}

export async function removeBooking(id: string): Promise<void> {
    if (!await repository.removeBooking(id)) {
        throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
    }
}

/** Правила брони: период, ссылки и отсутствие пересечений по ТС. */
async function assertBookingValid(input: IBookingInput, selfId: string): Promise<void> {
    if (input.startsAt >= input.endsAt) {
        throw new ApiError(400, ErrorCode.Validation, 'Окончание брони должно быть позже начала');
    }
    if (!await repository.vehicleExists(input.vehicleId)) {
        throw new ApiError(400, ErrorCode.Validation, 'Выбранное ТС не найдено');
    }
    if (!await repository.driverExists(input.driverId)) {
        throw new ApiError(400, ErrorCode.Validation, 'Выбранный водитель не найден');
    }
    if (await repository.bookingOverlaps(input, selfId)) {
        throw new ApiError(409, ErrorCode.Conflict, 'Это ТС уже забронировано на указанный период');
    }
}
