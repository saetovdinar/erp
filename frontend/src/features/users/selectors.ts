import type { IAppState } from '../../app/types';

import type { IUserAccount } from './types';

export function selectUsers(state: IAppState): IUserAccount[] {
    return state.users.items;
}

export function selectUsersError(state: IAppState): string | null {
    return state.users.error;
}

export function selectUsersLoading(state: IAppState): boolean {
    return state.users.loading;
}
