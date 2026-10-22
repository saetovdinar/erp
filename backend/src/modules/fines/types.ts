// Контракт API штрафов — 1:1 с фронтовым features/fines/types.ts.
// Ключи интерфейсов отсортированы — правило typescript-sort-keys/interface.

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

/** Строка из SQL: snake_case, дата уже приведена to_char'ом к строке. */
export interface IFineRow {
    amount: number;
    article: string;
    date: string;
    driver_id: string | null;
    id: string;
    is_paid: boolean;
    vehicle_id: string;
}
