import { request } from '../../api/client';

import type { ILoginInput, ILoginResult, IUser } from './types';

// HTTP-доступ к авторизации; сам токен хранит client.ts (localStorage)
export const authApi = {
    login(input: ILoginInput): Promise<ILoginResult> {
        return request<ILoginResult>('POST', '/v1/auth/login', input);
    },

    me(): Promise<IUser> {
        return request<IUser>('GET', '/v1/auth/me');
    }
};
