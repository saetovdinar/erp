import { DRIVERS_ERROR, DRIVERS_LOADED, DRIVERS_LOADING } from './actionTypes';
import type { DriversAction } from './actions';
import type { IDriversState } from './types';

const initialState: IDriversState = {
    error: null,
    items: [],
    loading: false
};

export function driversReducer(state: IDriversState = initialState, action: DriversAction): IDriversState {
    switch (action.type) {
    case DRIVERS_ERROR:
        return { ...state,
            error: action.message,
            loading: false };
    case DRIVERS_LOADED:
        return { ...state,
            error: null,
            items: action.items,
            loading: false };
    case DRIVERS_LOADING:
        return { ...state,
            error: null,
            loading: true };
    default:
        return state;
    }
}
