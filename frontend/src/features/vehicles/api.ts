// Мок-реализация доступа к данным ТС: имитирует задержку сети и
// бизнес-правила будущего API. Следующий этап — заменить на fetch.

import { type ICrudRepo, bookings, delay, fines, indexOf, uid, vehicles } from '../../mocks/db';

import type { IVehicle, IVehicleInput } from './types';

export const vehiclesApi: ICrudRepo<IVehicle, IVehicleInput> = {
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
