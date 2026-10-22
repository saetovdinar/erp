export interface IApiSuccess<T> {
    data: T;
    success: true;
}

export interface IApiFailure {
    error: {
        code: string;
        details?: unknown;
        message: string;
    };
    success: false;
}

export type ApiResponseBody<T> = IApiSuccess<T> | IApiFailure;
