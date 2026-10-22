export type HealthDb = 'down' | 'unknown' | 'up';

export type HealthStatus = 'checking' | 'down' | 'up';

export interface IHealthState {
    db: HealthDb;
    status: HealthStatus;
}
