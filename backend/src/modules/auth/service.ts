import bcrypt from 'bcryptjs';

import { config } from '../../config';
import { ApiError } from '../../errors/ApiError';
import { ErrorCode } from '../../errors/ErrorCode';
import { signToken } from '../../services/jwt';

import { findUserById, findUserByLogin, updateUserPassword } from './repository';
import type { ILoginResult, IUser, IUserRow } from './types';

// bcrypt.compare при любом исходе занимает одно время: хэш-заглушка прячет
// отсутствие пользователя (иначе логин угадывается по скорости ответа)
const DUMMY_HASH = bcrypt.hashSync('не-пароль-а-заглушка', 10);

function toUser(row: IUserRow): IUser {
    return { id: row.id,
        login: row.login,
        role: row.role };
}

export async function login(userLogin: string, password: string): Promise<ILoginResult> {
    const user = await findUserByLogin(userLogin);
    const ok = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);

    if (!user || !ok) {
        throw new ApiError(401, ErrorCode.Unauthorized, 'Неверный логин или пароль');
    }

    return {
        expiresIn: config.jwtTtlDays * 86_400,
        token: signToken({ id: user.id,
            login: user.login,
            role: user.role }),
        tokenType: 'bearer',
        user: toUser(user)
    };
}

export async function me(userId: string): Promise<IUser> {
    const user = await findUserById(userId);

    if (!user) {
        throw new ApiError(401, ErrorCode.Unauthorized, 'Пользователь не найден');
    }

    return toUser(user);
}

/** Смена собственного пароля: текущий подтверждается, новый — от 8 символов. */
export async function changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
): Promise<void> {
    const user = await findUserById(userId);
    const ok = await bcrypt.compare(currentPassword, user?.password_hash ?? DUMMY_HASH);

    if (!user || !ok) {
        throw new ApiError(401, ErrorCode.Unauthorized, 'Неверный пароль');
    }

    await updateUserPassword(userId, await bcrypt.hash(newPassword, 10));
}
