import { ApiError } from '../../errors/ApiError';
import { ErrorCode } from '../../errors/ErrorCode';
import { isUniqueViolation } from '../../utils/pgErrors';

import * as repository from './repository';
import type { IDriver, IDriverInput } from './types';

export async function listDrivers(): Promise<IDriver[]> {
    return await repository.listDrivers();
}

export async function createDriver(input: IDriverInput): Promise<IDriver> {
    try {
        return await repository.createDriver(input);
    } catch (err: unknown) {
        if (isUniqueViolation(err)) {
            throw new ApiError(409, ErrorCode.Conflict, 'Водитель с таким номером прав уже существует');
        }

        throw err;
    }
}

export async function updateDriver(id: string, input: IDriverInput): Promise<IDriver> {
    try {
        const driver = await repository.updateDriver(id, input);

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

export async function removeDriver(id: string): Promise<void> {
    if (await repository.driverHasDependencies(id)) {
        throw new ApiError(409, ErrorCode.Conflict,
            'Нельзя удалить водителя: есть связанные штрафы или бронирования');
    }
    if (!await repository.removeDriver(id)) {
        throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
    }
}
