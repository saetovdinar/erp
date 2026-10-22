// Мок-реализация доступа к данным штрафов: имитирует задержку сети и
// бизнес-правила будущего API. Следующий этап — заменить на fetch.

import { type ICrudRepo, delay, drivers, fines, indexOf, uid, vehicles } from '../../mocks/db';

import type { IFine, IFineInput } from './types';

export const finesApi: ICrudRepo<IFine, IFineInput> = {
    async create(input) {
        await delay();
        assertFineValid(input);

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
        assertFineValid(input);
        fines[indexOf(fines, id)] = { ...input,
            id };

        return fines[indexOf(fines, id)];
    }
};

function assertFineValid(input: IFineInput): void {
    if (!vehicles.some(v => v.id === input.vehicleId)) {
        throw new Error('Выбранное ТС не найдено');
    }
    if (input.driverId !== null && !drivers.some(d => d.id === input.driverId)) {
        throw new Error('Выбранный водитель не найден');
    }
}
