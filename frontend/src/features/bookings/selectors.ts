import type { IAppState } from '../../app/types';

import type { IBooking } from './types';

export function selectBookings(state: IAppState): IBooking[] {
    return state.bookings.items;
}

export function selectBookingsError(state: IAppState): string | null {
    return state.bookings.error;
}

export function selectBookingsLoading(state: IAppState): boolean {
    return state.bookings.loading;
}
