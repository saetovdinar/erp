/** Ответ /v1/health: API жив, но его БД может быть недоступна (система мониторинга). */
export interface IHealthStatus {
    db: 'down' | 'up';
    status: 'ok';
    time: string;
}
