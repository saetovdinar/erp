import type { IAppState } from '../../app/types';

import type { HealthDb, HealthStatus } from './types';

export function selectHealthDb(state: IAppState): HealthDb {
    return state.health.db;
}

export function selectHealthStatus(state: IAppState): HealthStatus {
    return state.health.status;
}
