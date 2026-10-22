// Контракт API водителей — 1:1 с фронтовым features/drivers/types.ts.
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

/** Строка из SQL: snake_case, даты уже приведены to_char'ом к строкам. */
export interface IDriverRow {
    experience_years: number;
    full_name: string;
    hired_at: string;
    id: string;
    license_number: string;
    phone: string;
    status: DriverStatus;
}
