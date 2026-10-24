import type { AppThunk } from '../../app/types';

import { USERS_ERROR, USERS_LOADED, USERS_LOADING } from './actionTypes';
import { usersApi } from './api';
import type { IUserAccount, IUserCreateInput } from './types';

export interface IUsersErrorAction {
    message: string;
    type: typeof USERS_ERROR;
}

export interface IUsersLoadedAction {
    items: IUserAccount[];
    type: typeof USERS_LOADED;
}

export interface IUsersLoadingAction {
    type: typeof USERS_LOADING;
}

export type UsersAction = IUsersErrorAction | IUsersLoadedAction | IUsersLoadingAction;

export function usersError(message: string): IUsersErrorAction {
    return { message,
        type: USERS_ERROR };
}

export function usersLoaded(items: IUserAccount[]): IUsersLoadedAction {
    return { items,
        type: USERS_LOADED };
}

export function usersLoading(): IUsersLoadingAction {
    return { type: USERS_LOADING };
}

export function loadUsers(): AppThunk {
    return async dispatch => {
        dispatch(usersLoading());
        try {
            dispatch(usersLoaded(await usersApi.list()));
        } catch (error) {
            dispatch(usersError(error instanceof Error ? error.message : 'Ошибка загрузки'));
        }
    };
}

export function createUser(input: IUserCreateInput): AppThunk {
    return async dispatch => {
        await usersApi.create(input);
        await dispatch(loadUsers());
    };
}

/** Сброс пароля учётки админом. */
export function resetUserPassword(id: string, password: string): AppThunk {
    return async dispatch => {
        await usersApi.resetPassword(id, password);
        await dispatch(loadUsers());
    };
}

/** Удаление учётки вместе с её данными (каскад на стороне API). */
export function removeUser(id: string): AppThunk {
    return async dispatch => {
        await usersApi.remove(id);
        await dispatch(loadUsers());
    };
}
