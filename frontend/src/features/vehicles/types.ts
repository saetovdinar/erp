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

export interface IVehiclesState {
    error: string | null;
    items: IVehicle[];
    loading: boolean;
}
