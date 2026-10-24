import { ApiError } from '../../errors/ApiError';
import { ErrorCode } from '../../errors/ErrorCode';

import * as repository from './repository';
import type { IBooking, IBookingInput } from './types';

// исключение собственной записи при поиске пересечения на create
export const NIL_UUID = '00000000-0000-0000-0000-000000000000';

export async function listBookings(userId: string): Promise<IBooking[]> {
    return await repository.listBookings(userId);
}

export async function createBooking(userId: string, input: IBookingInput): Promise<IBooking> {
    await assertBookingValid(input, NIL_UUID, userId);

    return repository.createBooking(userId, input);
}

export async function updateBooking(
        userId: string,
        id: string,
        input: IBookingInput
): Promise<IBooking> {
    await assertBookingValid(input, id, userId);

    const booking = await repository.updateBooking(userId, id, input);

    if (!booking) {
        throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
    }

    return booking;
}

export async function removeBooking(userId: string, id: string): Promise<void> {
    if (!await repository.removeBooking(userId, id)) {
        throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
    }
}

/** Правила брони: период, ссылки и отсутствие пересечений по ТС. */
async function assertBookingValid(
        input: IBookingInput,
        selfId: string,
        userId: string
): Promise<void> {
    if (input.startsAt >= input.endsAt) {
        throw new ApiError(400, ErrorCode.Validation, 'Окончание брони должно быть позже начала');
    }
    if (!await repository.vehicleExists(input.vehicleId, userId)) {
        throw new ApiError(400, ErrorCode.Validation, 'Выбранное ТС не найдено');
    }
    if (!await repository.driverExists(input.driverId, userId)) {
        throw new ApiError(400, ErrorCode.Validation, 'Выбранный водитель не найден');
    }
    if (await repository.bookingOverlaps(input, selfId)) {
        throw new ApiError(409, ErrorCode.Conflict, 'Это ТС уже забронировано на указанный период');
    }
}
