import type { IAppState } from '../../app/types';

import type { IVehicle } from './types';

export function selectVehicles(state: IAppState): IVehicle[] {
    return state.vehicles.items;
}

export function selectVehiclesError(state: IAppState): string | null {
    return state.vehicles.error;
}

export function selectVehiclesLoading(state: IAppState): boolean {
    return state.vehicles.loading;
}
