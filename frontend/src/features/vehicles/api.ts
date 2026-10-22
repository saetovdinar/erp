// HTTP-доступ к данным ТС: валидация и бизнес-правила — на API.

import { createCrudApi } from '../../api/client';

import type { IVehicle, IVehicleInput } from './types';

export const vehiclesApi = createCrudApi<IVehicle, IVehicleInput>('/v1/vehicles');
