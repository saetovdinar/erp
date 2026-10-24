import type { UserRole } from '../auth/types';

/** Учётка в списке (без password_hash); created_at — строка для таблицы. */
export interface IUserAccount {
    createdAt: string;
    id: string;
    login: string;
    role: UserRole;
}

/** Строка выборки списком: created_at уже приведён к строке в SQL. */
export interface IUserAccountRow {
    created_at: string;
    id: string;
    login: string;
    role: UserRole;
}

/** Тело создания учётки (логин неизменяем, задаётся при создании). */
export interface IUserCreateInput {
    login: string;
    password: string;
}
