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

/** Запрос к API с конвертом {success,data} / {success,error} (см. backend/src/shared/api). */
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    let res: Response;

    try {
        res = await fetch(path, {
            body: body === undefined ? undefined : JSON.stringify(body),
            headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
            method
        });
    } catch {
        throw new Error('API недоступен');
    }

    let payload: ApiBody<T>;

    try {
        payload = await res.json() as ApiBody<T>;
    } catch {
        throw new Error(`API недоступен (HTTP ${res.status})`);
    }

    if (!payload.success) {
        throw new Error(payload.error.message);
    }

    return payload.data;
}

function get<T>(path: string): Promise<T> {
    return request<T>('GET', path);
}

export function getHealth(): Promise<IHealthData> {
    return get<IHealthData>('/v1/health');
}

/** CRUD-клиент сущности: единый контракт для features/<фича>/api.ts. */
export interface ICrudApi<T, TInput> {
    create: (input: TInput) => Promise<T>;
    list: () => Promise<T[]>;
    remove: (id: string) => Promise<void>;
    update: (id: string, input: TInput) => Promise<T>;
}

export function createCrudApi<T, TInput>(resource: string): ICrudApi<T, TInput> {
    return {
        async create(input) {
            return await request<T>('POST', resource, input);
        },
        async list() {
            return await request<T[]>('GET', resource);
        },
        async remove(id) {
            await request<null>('DELETE', `${resource}/${id}`);
        },
        async update(id, input) {
            return await request<T>('PUT', `${resource}/${id}`, input);
        }
    };
}
