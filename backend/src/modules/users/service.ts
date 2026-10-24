import bcrypt from 'bcryptjs';

import { ApiError } from '../../errors/ApiError';
import { ErrorCode } from '../../errors/ErrorCode';
import { isUniqueViolation } from '../../utils/pgErrors';
import { findUserByLogin } from '../auth/repository';

import * as repository from './repository';
import type { IUserAccount } from './types';

const BCRYPT_ROUNDS = 10;

export async function listUsers(): Promise<IUserAccount[]> {
    return await repository.listUsers();
}

/** Новая учётка — всегда role user (второго админа создать нельзя). */
export async function createUser(login: string, password: string): Promise<IUserAccount> {
    if (await findUserByLogin(login)) {
        throw new ApiError(409, ErrorCode.Conflict, 'Этот логин уже занят');
    }

    try {
        return await repository.createUser(login, await bcrypt.hash(password, BCRYPT_ROUNDS));
    } catch (err: unknown) {
        if (isUniqueViolation(err)) {
            throw new ApiError(409, ErrorCode.Conflict, 'Этот логин уже занят');
        }

        throw err;
    }
}

/** Сброс пароля админом (логин неизменяем). */
export async function resetPassword(id: string, password: string): Promise<void> {
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    if (!await repository.updateUserPassword(id, hash)) {
        throw new ApiError(404, ErrorCode.NotFound, 'Пользователь не найден');
    }
}

/** Удаление учётки вместе с её данными; себя удалить нельзя. */
export async function removeUser(id: string, requesterId: string): Promise<void> {
    if (id === requesterId) {
        throw new ApiError(400, ErrorCode.Validation, 'Нельзя удалить свою учётку');
    }
    await repository.removeUserData(id);
    if (!await repository.removeUser(id)) {
        throw new ApiError(404, ErrorCode.NotFound, 'Пользователь не найден');
    }
}
