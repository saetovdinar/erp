import type { IAppState } from '../../app/types';

import type { IFine } from './types';

export function selectFines(state: IAppState): IFine[] {
    return state.fines.items;
}

export function selectFinesError(state: IAppState): string | null {
    return state.fines.error;
}

export function selectFinesLoading(state: IAppState): boolean {
    return state.fines.loading;
}
