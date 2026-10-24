import { ApiError } from '../../errors/ApiError';
import { ErrorCode } from '../../errors/ErrorCode';
import { isUniqueViolation } from '../../utils/pgErrors';

import * as repository from './repository';
import type { IDriver, IDriverInput } from './types';

export async function listDrivers(userId: string): Promise<IDriver[]> {
    return await repository.listDrivers(userId);
}

export async function createDriver(userId: string, input: IDriverInput): Promise<IDriver> {
    try {
        return await repository.createDriver(userId, input);
    } catch (err: unknown) {
        if (isUniqueViolation(err)) {
            throw new ApiError(409, ErrorCode.Conflict, 'Водитель с таким номером прав уже существует');
        }

        throw err;
    }
}

export async function updateDriver(
        userId: string,
        id: string,
        input: IDriverInput
): Promise<IDriver> {
    try {
        const driver = await repository.updateDriver(userId, id, input);

        if (!driver) {
            throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
        }

        return driver;
    } catch (err: unknown) {
        if (isUniqueViolation(err)) {
            throw new ApiError(409, ErrorCode.Conflict, 'Водитель с таким номером прав уже существует');
        }

        throw err;
    }
}

export async function removeDriver(userId: string, id: string): Promise<void> {
    if (await repository.driverHasDependencies(id)) {
        throw new ApiError(409, ErrorCode.Conflict,
            'Нельзя удалить водителя: есть связанные штрафы или бронирования');
    }
    if (!await repository.removeDriver(userId, id)) {
        throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
    }
}
