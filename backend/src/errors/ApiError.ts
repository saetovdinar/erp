import { ErrorCode } from './ErrorCode';

export class ApiError extends Error {
    constructor(
            readonly status: number,
            readonly code: ErrorCode | string,
            message: string,
            readonly details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';

        // после транспиляции в CommonJS прототип теряется — восстанавливаем,
        // иначе instanceof ApiError в errorHandler перестаёт работать
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
