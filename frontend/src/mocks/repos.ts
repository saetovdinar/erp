import type {
    IBooking,
    IBookingInput,
    ICrudRepo,
    IDriver,
    IDriverInput,
    IFine,
    IFineInput,
    IVehicle,
    IVehicleInput
} from '../types/entities';

import { bookings, drivers, fines, vehicles } from './data';

// Мок-репозитории: имитируют задержку сети и бизнес-правила будущего API
// (пересечение броней, ссылки при удалении, существование связанных записей).
// Следующий этап — заменить на HTTP-реализации тех же интерфейсов.

const DELAY_MS = 120;

function delay(): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, DELAY_MS);
    });
}

function uid(): string {
    return crypto.randomUUID();
}

function indexOf<T extends { id: string; }>(items: T[], id: string): number {
    const i = items.findIndex(item => item.id === id);

    if (i < 0) {
        throw new Error('Запись не найдена');
    }

    return i;
}

function periodsOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
    return aStart < bEnd && bStart < aEnd;
}

export const driverRepo: ICrudRepo<IDriver, IDriverInput> = {
    async create(input) {
        await delay();

        const item: IDriver = { ...input,
            id: uid() };

        drivers.push(item);

        return item;
    },
    async list() {
        await delay();

        return [ ...drivers ];
    },
    async remove(id) {
        await delay();

        const used = fines.some(f => f.driverId === id) || bookings.some(b => b.driverId === id);

        if (used) {
            throw new Error('Нельзя удалить водителя: есть связанные штрафы или бронирования');
        }
        drivers.splice(indexOf(drivers, id), 1);
    },
    async update(id, input) {
        await delay();
        drivers[indexOf(drivers, id)] = { ...input,
            id };

        return drivers[indexOf(drivers, id)];
    }
};

export const vehicleRepo: ICrudRepo<IVehicle, IVehicleInput> = {
    async create(input) {
        await delay();

        const item: IVehicle = { ...input,
            id: uid() };

        vehicles.push(item);

        return item;
    },
    async list() {
        await delay();

        return [ ...vehicles ];
    },
    async remove(id) {
        await delay();

        const used = fines.some(f => f.vehicleId === id) || bookings.some(b => b.vehicleId === id);

        if (used) {
            throw new Error('Нельзя удалить ТС: есть связанные штрафы или бронирования');
        }
        vehicles.splice(indexOf(vehicles, id), 1);
    },
    async update(id, input) {
        await delay();
        vehicles[indexOf(vehicles, id)] = { ...input,
            id };

        return vehicles[indexOf(vehicles, id)];
    }
};

export const fineRepo: ICrudRepo<IFine, IFineInput> = {
    async create(input) {
        await delay();

        if (!vehicles.some(v => v.id === input.vehicleId)) {
            throw new Error('Выбранное ТС не найдено');
        }
        if (input.driverId !== null && !drivers.some(d => d.id === input.driverId)) {
            throw new Error('Выбранный водитель не найден');
        }

        const item: IFine = { ...input,
            id: uid() };

        fines.push(item);

        return item;
    },
    async list() {
        await delay();

        return [ ...fines ];
    },
    async remove(id) {
        await delay();
        fines.splice(indexOf(fines, id), 1);
    },
    async update(id, input) {
        await delay();

        if (!vehicles.some(v => v.id === input.vehicleId)) {
            throw new Error('Выбранное ТС не найдено');
        }
        if (input.driverId !== null && !drivers.some(d => d.id === input.driverId)) {
            throw new Error('Выбранный водитель не найден');
        }
        fines[indexOf(fines, id)] = { ...input,
            id };

        return fines[indexOf(fines, id)];
    }
};

export const bookingRepo: ICrudRepo<IBooking, IBookingInput> = {
    async create(input) {
        await delay();

        assertBookingValid(input);

        const item: IBooking = { ...input,
            id: uid() };

        bookings.push(item);

        return item;
    },
    async list() {
        await delay();

        return [ ...bookings ];
    },
    async remove(id) {
        await delay();
        bookings.splice(indexOf(bookings, id), 1);
    },
    async update(id, input) {
        await delay();

        assertBookingValid(input, id);
        bookings[indexOf(bookings, id)] = { ...input,
            id };

        return bookings[indexOf(bookings, id)];
    }
};

function assertBookingValid(input: IBookingInput, selfId?: string): void {
    if (input.startsAt >= input.endsAt) {
        throw new Error('Окончание брони должно быть позже начала');
    }
    if (!vehicles.some(v => v.id === input.vehicleId)) {
        throw new Error('Выбранное ТС не найдено');
    }
    if (!drivers.some(d => d.id === input.driverId)) {
        throw new Error('Выбранный водитель не найден');
    }

    const conflict = bookings.some(b => b.id !== selfId
        && b.vehicleId === input.vehicleId
        && b.status !== 'cancelled'
        && periodsOverlap(input.startsAt, input.endsAt, b.startsAt, b.endsAt));

    if (conflict) {
        throw new Error('Это ТС уже забронировано на указанный период');
    }
}
