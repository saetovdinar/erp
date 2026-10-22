// HTTP-доступ к данным штрафов: валидация и бизнес-правила — на API.

import { createCrudApi } from '../../api/client';

import type { IFine, IFineInput } from './types';

export const finesApi = createCrudApi<IFine, IFineInput>('/v1/fines');
