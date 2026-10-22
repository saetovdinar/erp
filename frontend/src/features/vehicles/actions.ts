import type { AppThunk } from '../../app/types';

import { VEHICLES_ERROR, VEHICLES_LOADED, VEHICLES_LOADING } from './actionTypes';
import { vehiclesApi } from './api';
import type { IVehicle, IVehicleInput } from './types';

export interface IVehiclesErrorAction {
    message: string;
    type: typeof VEHICLES_ERROR;
}

export interface IVehiclesLoadedAction {
    items: IVehicle[];
    type: typeof VEHICLES_LOADED;
}

export interface IVehiclesLoadingAction {
    type: typeof VEHICLES_LOADING;
}

export type VehiclesAction = IVehiclesErrorAction | IVehiclesLoadedAction | IVehiclesLoadingAction;

export function vehiclesError(message: string): IVehiclesErrorAction {
    return { message,
        type: VEHICLES_ERROR };
}

export function vehiclesLoaded(items: IVehicle[]): IVehiclesLoadedAction {
    return { items,
        type: VEHICLES_LOADED };
}

export function vehiclesLoading(): IVehiclesLoadingAction {
    return { type: VEHICLES_LOADING };
}

export function loadVehicles(): AppThunk {
    return async dispatch => {
        dispatch(vehiclesLoading());
        try {
            dispatch(vehiclesLoaded(await vehiclesApi.list()));
        } catch (error) {
            dispatch(vehiclesError(error instanceof Error ? error.message : 'Ошибка загрузки'));
        }
    };
}

export function createVehicle(input: IVehicleInput): AppThunk {
    return async dispatch => {
        await vehiclesApi.create(input);
        await dispatch(loadVehicles());
    };
}

export function updateVehicle(id: string, input: IVehicleInput): AppThunk {
    return async dispatch => {
        await vehiclesApi.update(id, input);
        await dispatch(loadVehicles());
    };
}

export function removeVehicle(id: string): AppThunk {
    return async dispatch => {
        await vehiclesApi.remove(id);
        await dispatch(loadVehicles());
    };
}
