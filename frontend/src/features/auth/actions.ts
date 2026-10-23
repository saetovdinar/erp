import { clearToken, setToken } from '../../api/client';
import type { AppThunk } from '../../app/types';

import { AUTH_LOGIN_FAILED, AUTH_LOGIN_SUCCEEDED, AUTH_LOGOUT } from './actionTypes';
import { authApi } from './api';
import type { ILoginInput, IUser } from './types';

export interface IAuthLoginFailedAction {
    type: typeof AUTH_LOGIN_FAILED;
}

export interface IAuthLoginSucceededAction {
    type: typeof AUTH_LOGIN_SUCCEEDED;
    user: IUser;
}

export interface IAuthLogoutAction {
    type: typeof AUTH_LOGOUT;
}

export type AuthAction = IAuthLoginFailedAction | IAuthLoginSucceededAction | IAuthLogoutAction;

export function authLoginFailed(): IAuthLoginFailedAction {
    return { type: AUTH_LOGIN_FAILED };
}

export function authLoginSucceeded(user: IUser): IAuthLoginSucceededAction {
    return { type: AUTH_LOGIN_SUCCEEDED,
        user };
}

/** Выход: чистим токен и состояние (редирект — на стороне компонента). */
export function authLogout(): IAuthLogoutAction {
    clearToken();

    return { type: AUTH_LOGOUT };
}

/** Вход: токен — в localStorage, пользователь — в стор. Ошибка летит в форму. */
export function login(input: ILoginInput): AppThunk<Promise<void>> {
    return async dispatch => {
        const result = await authApi.login(input);

        setToken(result.token);
        dispatch(authLoginSucceeded(result.user));
    };
}

/** Восстановление сессии после перезагрузки (токен уже есть в localStorage). */
export function restoreSession(): AppThunk<Promise<void>> {
    return async dispatch => {
        try {
            dispatch(authLoginSucceeded(await authApi.me()));
        } catch {
            dispatch(authLoginFailed());
        }
    };
}
