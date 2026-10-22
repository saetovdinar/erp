import { HEALTH_CHECK_FAILED, HEALTH_CHECK_SUCCEEDED } from './actionTypes';
import type { HealthAction } from './actions';
import type { IHealthState } from './types';

const initialState: IHealthState = {
    db: 'unknown',
    status: 'checking'
};

export function healthReducer(state: IHealthState = initialState, action: HealthAction): IHealthState {
    switch (action.type) {
    case HEALTH_CHECK_FAILED:
        return { db: 'unknown',
            status: 'down' };
    case HEALTH_CHECK_SUCCEEDED:
        return { db: action.db,
            status: 'up' };
    default:
        return state;
    }
}
