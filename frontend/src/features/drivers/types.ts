// Ключи интерфейсов отсортированы — правило typescript-sort-keys/interface.

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

export interface IDriversState {
    error: string | null;
    items: IDriver[];
    loading: boolean;
}
