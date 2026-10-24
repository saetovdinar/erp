export type UserRole = 'admin' | 'user';

export interface IUser {
    id: string;
    login: string;
    role: UserRole;
}

export interface ILoginInput {
    login: string;
    password: string;
}

export interface ILoginResult {
    expiresIn: number;
    token: string;
    tokenType: 'bearer';
    user: IUser;
}

/** Тело PUT /v1/auth/password. */
export interface IChangePasswordInput {
    currentPassword: string;
    newPassword: string;
}

/** 'checking' — токен есть, личность уточняем через /v1/auth/me. */
export type AuthStatus = 'checking' | 'in' | 'out';

export interface IAuthState {
    status: AuthStatus;
    user: IUser | null;
}
