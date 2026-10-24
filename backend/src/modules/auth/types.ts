export type UserRole = 'admin' | 'user';

/** Строка таблицы users (snake_case из SQL). */
export interface IUserRow {
    created_at: Date;
    id: string;
    login: string;
    password_hash: string;
    role: UserRole;
}

/** Пользователь наружу — без password_hash. */
export interface IUser {
    id: string;
    login: string;
    role: UserRole;
}

export interface ILoginResult {
    expiresIn: number;
    token: string;
    tokenType: 'bearer';
    user: IUser;
}
