// Ключи интерфейсов отсортированы — правило typescript-sort-keys/interface.

export type BookingStatus = 'active' | 'cancelled' | 'completed' | 'planned';

export interface IBooking {
    driverId: string;
    endsAt: string;
    id: string;
    purpose: string;
    startsAt: string;
    status: BookingStatus;
    vehicleId: string;
}

export type IBookingInput = Omit<IBooking, 'id'>;

export interface IBookingsState {
    error: string | null;
    items: IBooking[];
    loading: boolean;
}
