// Сущности ERP (утверждённое ТЗ). Ключи интерфейсов отсортированы —
// правило typescript-sort-keys/interface; значения enum — string-enum.

export type DriverStatus = 'active' | 'fired' | 'vacation';

export interface IDriver {
    experienceYears: number;
    fullName: string;
    hiredAt: string;
    id: string;
    licenseNumber: string;
    phone: string;
    status: DriverStatus;
}

export type IDriverInput = Omit<IDriver, 'id'>;

export type VehicleStatus = 'active' | 'maintenance' | 'retired';

export type VehicleType = 'minivan' | 'sedan' | 'suv' | 'wagon';

export interface IVehicle {
    id: string;
    make: string;
    mileage: number;
    model: string;
    plate: string;
    status: VehicleStatus;
    vehicleType: VehicleType;
    year: number;
}

export type IVehicleInput = Omit<IVehicle, 'id'>;

export interface IFine {
    amount: number;
    article: string;
    date: string;
    driverId: string | null;
    id: string;
    isPaid: boolean;
    vehicleId: string;
}

export type IFineInput = Omit<IFine, 'id'>;

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

/** Репозиторий сущности: мок-реализация сейчас, HTTP к API — следующим этапом. */
export interface ICrudRepo<T, TInput> {
    create: (input: TInput) => Promise<T>;
    list: () => Promise<T[]>;
    remove: (id: string) => Promise<void>;
    update: (id: string, input: TInput) => Promise<T>;
}
