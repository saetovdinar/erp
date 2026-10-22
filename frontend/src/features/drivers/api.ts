// Мок-реализация доступа к данным водителей: имитирует задержку сети и
// бизнес-правила будущего API. Следующий этап — заменить на fetch.

import { type ICrudRepo, bookings, delay, drivers, fines, indexOf, uid } from '../../mocks/db';

import type { IDriver, IDriverInput } from './types';

export const driversApi: ICrudRepo<IDriver, IDriverInput> = {
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
