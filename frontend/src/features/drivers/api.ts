// HTTP-доступ к данным водителей: валидация и бизнес-правила — на API.

import { createCrudApi } from '../../api/client';

import type { IDriver, IDriverInput } from './types';

export const driversApi = createCrudApi<IDriver, IDriverInput>('/v1/drivers');
