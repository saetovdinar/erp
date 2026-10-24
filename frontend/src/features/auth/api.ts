import { request } from '../../api/client';

import type { IChangePasswordInput, ILoginInput, ILoginResult, IUser } from './types';

// HTTP-доступ к авторизации; сам токен хранит client.ts (localStorage)
export const authApi = {
    changePassword(input: IChangePasswordInput): Promise<null> {
        return request<null>('PUT', '/v1/auth/password', input);
    },

    login(input: ILoginInput): Promise<ILoginResult> {
        return request<ILoginResult>('POST', '/v1/auth/login', input);
    },

    me(): Promise<IUser> {
        return request<IUser>('GET', '/v1/auth/me');
    }
};
