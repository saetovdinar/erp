import { pingDb } from './repository';
import type { IHealthStatus } from './types';

/** Сводка самочувствия API: живость БД + отметка времени. */
export async function getHealthStatus(): Promise<IHealthStatus> {
    const dbUp = await pingDb();

    return {
        db: dbUp ? 'up' : 'down',
        status: 'ok',
        time: new Date().toISOString()
    };
}
