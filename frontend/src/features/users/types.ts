import type { UserRole } from '../auth/types';

/** Учётка в списке (контракт GET /v1/users); логин неизменяем. */
export interface IUserAccount {
    createdAt: string;
    id: string;
    login: string;
    role: UserRole;
}

export interface IUserCreateInput {
    login: string;
    password: string;
}

export interface IUsersState {
    error: string | null;
    items: IUserAccount[];
    loading: boolean;
}
