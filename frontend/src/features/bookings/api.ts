// Мок-реализация доступа к данным бронирований: имитирует задержку сети и
// бизнес-правила будущего API. Следующий этап — заменить на fetch.

import { type ICrudRepo, bookings, delay, drivers, indexOf, uid, vehicles } from '../../mocks/db';

import type { IBooking, IBookingInput } from './types';

export const bookingsApi: ICrudRepo<IBooking, IBookingInput> = {
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

function periodsOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
    return aStart < bEnd && bStart < aEnd;
}
