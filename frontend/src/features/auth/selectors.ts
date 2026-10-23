import type { IAppState } from '../../app/types';

import type { AuthStatus, IUser } from './types';

export const selectAuthStatus = (state: IAppState): AuthStatus => state.auth.status;
export const selectAuthUser = (state: IAppState): IUser | null => state.auth.user;
