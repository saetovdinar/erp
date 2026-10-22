import { ApiError } from '../../errors/ApiError';
import { ErrorCode } from '../../errors/ErrorCode';
import { isUniqueViolation } from '../../utils/pgErrors';

import * as repository from './repository';
import type { IVehicle, IVehicleInput } from './types';

export async function listVehicles(): Promise<IVehicle[]> {
    return await repository.listVehicles();
}

export async function createVehicle(input: IVehicleInput): Promise<IVehicle> {
    try {
        return await repository.createVehicle(input);
    } catch (err: unknown) {
        if (isUniqueViolation(err)) {
            throw new ApiError(409, ErrorCode.Conflict, 'ТС с таким госномером уже существует');
        }

        throw err;
    }
}

export async function updateVehicle(id: string, input: IVehicleInput): Promise<IVehicle> {
    try {
        const vehicle = await repository.updateVehicle(id, input);

        if (!vehicle) {
            throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
        }

        return vehicle;
    } catch (err: unknown) {
        if (isUniqueViolation(err)) {
            throw new ApiError(409, ErrorCode.Conflict, 'ТС с таким госномером уже существует');
        }

        throw err;
    }
}

export async function removeVehicle(id: string): Promise<void> {
    if (await repository.vehicleHasDependencies(id)) {
        throw new ApiError(409, ErrorCode.Conflict,
            'Нельзя удалить ТС: есть связанные штрафы или бронирования');
    }
    if (!await repository.removeVehicle(id)) {
        throw new ApiError(404, ErrorCode.NotFound, 'Запись не найдена');
    }
}
