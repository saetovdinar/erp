import type { IAppState } from '../../app/types';

import type { IDriver } from './types';

export function selectDrivers(state: IAppState): IDriver[] {
    return state.drivers.items;
}

export function selectDriversError(state: IAppState): string | null {
    return state.drivers.error;
}

export function selectDriversLoading(state: IAppState): boolean {
    return state.drivers.loading;
}
