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

export interface IFinesState {
    error: string | null;
    items: IFine[];
    loading: boolean;
}
