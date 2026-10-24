// Формы корневого состояния и типизация thunk'ов (паттерн mint-client:
// чистый redux + redux-thunk, без toolkit).

import type { AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';

import type { IAuthState } from '../features/auth/types';
import type { IBookingsState } from '../features/bookings/types';
import type { IDriversState } from '../features/drivers/types';
import type { IFinesState } from '../features/fines/types';
import type { IHealthState } from '../features/health/types';
import type { IUsersState } from '../features/users/types';
import type { IVehiclesState } from '../features/vehicles/types';

export interface IAppState {
    auth: IAuthState;
    bookings: IBookingsState;
    drivers: IDriversState;
    fines: IFinesState;
    health: IHealthState;
    users: IUsersState;
    vehicles: IVehiclesState;
}

export type AppThunk<R = Promise<void>> = ThunkAction<R, IAppState, undefined, AnyAction>;
