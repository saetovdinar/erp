import { getToken } from '../../api/client';

import { AUTH_LOGIN_FAILED, AUTH_LOGIN_SUCCEEDED, AUTH_LOGOUT } from './actionTypes';
import type { AuthAction } from './actions';
import type { IAuthState } from './types';

// есть токен — сначала 'checking' (личность подтвердит /v1/auth/me), нет — 'out'
const initialState: IAuthState = {
    status: getToken() === null ? 'out' : 'checking',
    user: null
};

export function authReducer(state: IAuthState = initialState, action: AuthAction): IAuthState {
    switch (action.type) {
    case AUTH_LOGIN_FAILED:
        return { status: 'out',
            user: null };
    case AUTH_LOGIN_SUCCEEDED:
        return { status: 'in',
            user: action.user };
    case AUTH_LOGOUT:
        return { status: 'out',
            user: null };
    default:
        return state;
    }
}
