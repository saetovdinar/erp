import { getHealth } from '../../api/client';
import type { AppThunk } from '../../app/types';

import { HEALTH_CHECK_FAILED, HEALTH_CHECK_SUCCEEDED } from './actionTypes';
import type { HealthDb } from './types';

export interface IHealthCheckFailedAction {
    type: typeof HEALTH_CHECK_FAILED;
}

export interface IHealthCheckSucceededAction {
    db: HealthDb;
    type: typeof HEALTH_CHECK_SUCCEEDED;
}

export type HealthAction = IHealthCheckFailedAction | IHealthCheckSucceededAction;

export function healthCheckFailed(): IHealthCheckFailedAction {
    return { type: HEALTH_CHECK_FAILED };
}

export function healthCheckSucceeded(db: HealthDb): IHealthCheckSucceededAction {
    return { db,
        type: HEALTH_CHECK_SUCCEEDED };
}

export function checkHealth(): AppThunk {
    return async dispatch => {
        try {
            const health = await getHealth();

            dispatch(healthCheckSucceeded(health.db));
        } catch {
            dispatch(healthCheckFailed());
        }
    };
}
