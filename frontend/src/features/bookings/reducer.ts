import { BOOKINGS_ERROR, BOOKINGS_LOADED, BOOKINGS_LOADING } from './actionTypes';
import type { BookingsAction } from './actions';
import type { IBookingsState } from './types';

const initialState: IBookingsState = {
    error: null,
    items: [],
    loading: false
};

export function bookingsReducer(state: IBookingsState = initialState, action: BookingsAction): IBookingsState {
    switch (action.type) {
    case BOOKINGS_ERROR:
        return { ...state,
            error: action.message,
            loading: false };
    case BOOKINGS_LOADED:
        return { ...state,
            error: null,
            items: action.items,
            loading: false };
    case BOOKINGS_LOADING:
        return { ...state,
            error: null,
            loading: true };
    default:
        return state;
    }
}
