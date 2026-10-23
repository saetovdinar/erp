import { type AnyAction, type Reducer, applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { authReducer } from '../features/auth/reducer';
import { bookingsReducer } from '../features/bookings/reducer';
import { driversReducer } from '../features/drivers/reducer';
import { finesReducer } from '../features/fines/reducer';
import { healthReducer } from '../features/health/reducer';
import { vehiclesReducer } from '../features/vehicles/reducer';

import type { IAppState } from './types';

export const rootReducer = combineReducers({
    auth: authReducer,
    bookings: bookingsReducer,
    drivers: driversReducer,
    fines: finesReducer,
    health: healthReducer,
    vehicles: vehiclesReducer
});

// combineReducers выводит объединение узких типов действий фич; вывод
// генериков createStore на нём ломается (strict-режим). Приводим к корневому
// Reducer<IAppState, AnyAction> в одном месте — дальше типы стабильны.
const typedReducer = rootReducer as unknown as Reducer<IAppState, AnyAction>;

export const store = createStore(typedReducer, applyMiddleware(thunk));
