import { VEHICLES_ERROR, VEHICLES_LOADED, VEHICLES_LOADING } from './actionTypes';
import type { VehiclesAction } from './actions';
import type { IVehiclesState } from './types';

const initialState: IVehiclesState = {
    error: null,
    items: [],
    loading: false
};

export function vehiclesReducer(state: IVehiclesState = initialState, action: VehiclesAction): IVehiclesState {
    switch (action.type) {
    case VEHICLES_ERROR:
        return { ...state,
            error: action.message,
            loading: false };
    case VEHICLES_LOADED:
        return { ...state,
            error: null,
            items: action.items,
            loading: false };
    case VEHICLES_LOADING:
        return { ...state,
            error: null,
            loading: true };
    default:
        return state;
    }
}
