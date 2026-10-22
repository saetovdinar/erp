// Контракт API бронирований — 1:1 с фронтовым features/bookings/types.ts.
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

/** Строка из SQL: snake_case, время уже приведено к 'YYYY-MM-DDTHH:mm'. */
export interface IBookingRow {
    driver_id: string;
    ends_at: string;
    id: string;
    purpose: string;
    starts_at: string;
    status: BookingStatus;
    vehicle_id: string;
}
