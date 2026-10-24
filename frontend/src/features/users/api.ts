// HTTP-доступ к управлению учётками; эндпоинты принимает только роль admin.

import { request } from '../../api/client';

import type { IUserAccount, IUserCreateInput } from './types';

export const usersApi = {
    create(input: IUserCreateInput): Promise<IUserAccount> {
        return request<IUserAccount>('POST', '/v1/users', input);
    },

    list(): Promise<IUserAccount[]> {
        return request<IUserAccount[]>('GET', '/v1/users');
    },

    remove(id: string): Promise<null> {
        return request<null>('DELETE', `/v1/users/${id}`);
    },

    resetPassword(id: string, password: string): Promise<null> {
        return request<null>('PUT', `/v1/users/${id}`, { password });
    }
};
