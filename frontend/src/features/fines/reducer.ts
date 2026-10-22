import { FINES_ERROR, FINES_LOADED, FINES_LOADING } from './actionTypes';
import type { FinesAction } from './actions';
import type { IFinesState } from './types';

const initialState: IFinesState = {
    error: null,
    items: [],
    loading: false
};

export function finesReducer(state: IFinesState = initialState, action: FinesAction): IFinesState {
    switch (action.type) {
    case FINES_ERROR:
        return { ...state,
            error: action.message,
            loading: false };
    case FINES_LOADED:
        return { ...state,
            error: null,
            items: action.items,
            loading: false };
    case FINES_LOADING:
        return { ...state,
            error: null,
            loading: true };
    default:
        return state;
    }
}
