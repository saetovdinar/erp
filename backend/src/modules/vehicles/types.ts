// Контракт API транспортных средств — 1:1 с фронтовым features/vehicles/types.ts.
// Ключи интерфейсов отсортированы — правило typescript-sort-keys/interface.

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

/** Строка из SQL: snake_case. */
export interface IVehicleRow {
    id: string;
    make: string;
    mileage: number;
    model: string;
    plate: string;
    status: VehicleStatus;
    vehicle_type: VehicleType;
    year: number;
}
