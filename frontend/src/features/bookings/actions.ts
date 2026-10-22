import type { AppThunk } from '../../app/types';

import { BOOKINGS_ERROR, BOOKINGS_LOADED, BOOKINGS_LOADING } from './actionTypes';
import { bookingsApi } from './api';
import type { IBooking, IBookingInput } from './types';

export interface IBookingsErrorAction {
    message: string;
    type: typeof BOOKINGS_ERROR;
}

export interface IBookingsLoadedAction {
    items: IBooking[];
    type: typeof BOOKINGS_LOADED;
}

export interface IBookingsLoadingAction {
    type: typeof BOOKINGS_LOADING;
}

export type BookingsAction = IBookingsErrorAction | IBookingsLoadedAction | IBookingsLoadingAction;

export function bookingsError(message: string): IBookingsErrorAction {
    return { message,
        type: BOOKINGS_ERROR };
}

export function bookingsLoaded(items: IBooking[]): IBookingsLoadedAction {
    return { items,
        type: BOOKINGS_LOADED };
}

export function bookingsLoading(): IBookingsLoadingAction {
    return { type: BOOKINGS_LOADING };
}

export function loadBookings(): AppThunk {
    return async dispatch => {
        dispatch(bookingsLoading());
        try {
            dispatch(bookingsLoaded(await bookingsApi.list()));
        } catch (error) {
            dispatch(bookingsError(error instanceof Error ? error.message : 'Ошибка загрузки'));
        }
    };
}

export function createBooking(input: IBookingInput): AppThunk {
    return async dispatch => {
        await bookingsApi.create(input);
        await dispatch(loadBookings());
    };
}

export function updateBooking(id: string, input: IBookingInput): AppThunk {
    return async dispatch => {
        await bookingsApi.update(id, input);
        await dispatch(loadBookings());
    };
}

export function removeBooking(id: string): AppThunk {
    return async dispatch => {
        await bookingsApi.remove(id);
        await dispatch(loadBookings());
    };
}
