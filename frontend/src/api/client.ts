export interface IHealthData {
    db: 'down' | 'up';
    status: 'ok';
    time: string;
}

interface IApiSuccess<T> {
    data: T;
    success: true;
}

interface IApiFailure {
    error: {
        code: string;
        message: string;
    };
    success: false;
}

type ApiBody<T> = IApiSuccess<T> | IApiFailure;

/** GET к API с конвертом {success,data} / {success,error} (см. backend/src/shared/api). */
async function get<T>(path: string): Promise<T> {
    const res = await fetch(path);
    const body = await res.json() as ApiBody<T>;

    if (!body.success) {
        throw new Error(body.error.message);
    }

    return body.data;
}

export function getHealth(): Promise<IHealthData> {
    return get<IHealthData>('/v1/health');
}
