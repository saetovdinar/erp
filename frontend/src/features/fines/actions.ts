import type { AppThunk } from '../../app/types';

import { FINES_ERROR, FINES_LOADED, FINES_LOADING } from './actionTypes';
import { finesApi } from './api';
import type { IFine, IFineInput } from './types';

export interface IFinesErrorAction {
    message: string;
    type: typeof FINES_ERROR;
}

export interface IFinesLoadedAction {
    items: IFine[];
    type: typeof FINES_LOADED;
}

export interface IFinesLoadingAction {
    type: typeof FINES_LOADING;
}

export type FinesAction = IFinesErrorAction | IFinesLoadedAction | IFinesLoadingAction;

export function finesError(message: string): IFinesErrorAction {
    return { message,
        type: FINES_ERROR };
}

export function finesLoaded(items: IFine[]): IFinesLoadedAction {
    return { items,
        type: FINES_LOADED };
}

export function finesLoading(): IFinesLoadingAction {
    return { type: FINES_LOADING };
}

export function loadFines(): AppThunk {
    return async dispatch => {
        dispatch(finesLoading());
        try {
            dispatch(finesLoaded(await finesApi.list()));
        } catch (error) {
            dispatch(finesError(error instanceof Error ? error.message : 'Ошибка загрузки'));
        }
    };
}

export function createFine(input: IFineInput): AppThunk {
    return async dispatch => {
        await finesApi.create(input);
        await dispatch(loadFines());
    };
}

export function updateFine(id: string, input: IFineInput): AppThunk {
    return async dispatch => {
        await finesApi.update(id, input);
        await dispatch(loadFines());
    };
}

export function removeFine(id: string): AppThunk {
    return async dispatch => {
        await finesApi.remove(id);
        await dispatch(loadFines());
    };
}
