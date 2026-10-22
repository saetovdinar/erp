import { ApiError } from '../../errors/ApiError';
import { ErrorCode } from '../../errors/ErrorCode';

import * as repository from './repository';
import type { IFine, IFineInput } from './types';

export async function listFines(): Promise<IFine[]> {
    return await repository.listFines();
}

export async function createFine(input: IFineInput): Promise<IFine> {
    await assertFineValid(input);

    return repository.createFine(input);
}

export async function updateFine(id: string, input: IFineInput): Promise<IFine> {
    await assertFineValid(input);

    const fine = await repository.updateFine(id, input);

    if (!fine) {
        throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
    }

    return fine;
}

export async function removeFine(id: string): Promise<void> {
    if (!await repository.removeFine(id)) {
        throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
    }
}

/** Ссылочная целостность штрафа: ТС обязательно, водитель — по желанию. */
async function assertFineValid(input: IFineInput): Promise<void> {
    if (!await repository.vehicleExists(input.vehicleId)) {
        throw new ApiError(400, ErrorCode.Validation, 'Выбранное ТС не найдено');
    }
    if (input.driverId !== null && !await repository.driverExists(input.driverId)) {
        throw new ApiError(400, ErrorCode.Validation, 'Выбранный водитель не найден');
    }
}
