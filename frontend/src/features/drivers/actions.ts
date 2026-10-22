import type { AppThunk } from '../../app/types';

import { DRIVERS_ERROR, DRIVERS_LOADED, DRIVERS_LOADING } from './actionTypes';
import { driversApi } from './api';
import type { IDriver, IDriverInput } from './types';

export interface IDriversErrorAction {
    message: string;
    type: typeof DRIVERS_ERROR;
}

export interface IDriversLoadedAction {
    items: IDriver[];
    type: typeof DRIVERS_LOADED;
}

export interface IDriversLoadingAction {
    type: typeof DRIVERS_LOADING;
}

export type DriversAction = IDriversErrorAction | IDriversLoadedAction | IDriversLoadingAction;

export function driversError(message: string): IDriversErrorAction {
    return { message,
        type: DRIVERS_ERROR };
}

export function driversLoaded(items: IDriver[]): IDriversLoadedAction {
    return { items,
        type: DRIVERS_LOADED };
}

export function driversLoading(): IDriversLoadingAction {
    return { type: DRIVERS_LOADING };
}

export function loadDrivers(): AppThunk {
    return async dispatch => {
        dispatch(driversLoading());
        try {
            dispatch(driversLoaded(await driversApi.list()));
        } catch (error) {
            dispatch(driversError(error instanceof Error ? error.message : 'Ошибка загрузки'));
        }
    };
}

export function createDriver(input: IDriverInput): AppThunk {
    return async dispatch => {
        await driversApi.create(input);
        await dispatch(loadDrivers());
    };
}

export function updateDriver(id: string, input: IDriverInput): AppThunk {
    return async dispatch => {
        await driversApi.update(id, input);
        await dispatch(loadDrivers());
    };
}

export function removeDriver(id: string): AppThunk {
    return async dispatch => {
        await driversApi.remove(id);
        await dispatch(loadDrivers());
    };
}
