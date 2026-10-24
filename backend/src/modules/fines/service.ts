import { ApiError } from '../../errors/ApiError';
import { ErrorCode } from '../../errors/ErrorCode';

import * as repository from './repository';
import type { IFine, IFineInput } from './types';

export async function listFines(userId: string): Promise<IFine[]> {
    return await repository.listFines(userId);
}

export async function createFine(userId: string, input: IFineInput): Promise<IFine> {
    await assertFineValid(input, userId);

    return repository.createFine(userId, input);
}

export async function updateFine(userId: string, id: string, input: IFineInput): Promise<IFine> {
    await assertFineValid(input, userId);

    const fine = await repository.updateFine(userId, id, input);

    if (!fine) {
        throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
    }

    return fine;
}

export async function removeFine(userId: string, id: string): Promise<void> {
    if (!await repository.removeFine(userId, id)) {
        throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
    }
}

/** Ссылочная целостность штрафа: ТС обязательно, водитель — по желанию. */
async function assertFineValid(input: IFineInput, userId: string): Promise<void> {
    if (!await repository.vehicleExists(input.vehicleId, userId)) {
        throw new ApiError(400, ErrorCode.Validation, 'Выбранное ТС не найдено');
    }
    if (input.driverId !== null && !await repository.driverExists(input.driverId, userId)) {
        throw new ApiError(400, ErrorCode.Validation, 'Выбранный водитель не найден');
    }
}
