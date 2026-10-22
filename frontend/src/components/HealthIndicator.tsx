import { useCallback, useEffect, useState } from 'react';

import { getHealth } from '../api/client';

const REFRESH_MS = 5000;

type Status = 'checking' | 'down' | 'up';

/** Индикатор самочувствия API/БД в подвале меню (пинг /v1/health). */
export function HealthIndicator() {
    const [ db, setDb ] = useState<'down' | 'unknown' | 'up'>('unknown');
    const [ status, setStatus ] = useState<Status>('checking');

    const _onRefresh = useCallback(async () => {
        try {
            const health = await getHealth();

            setDb(health.db);
            setStatus('up');
        } catch {
            setDb('unknown');
            setStatus('down');
        }
    }, []);

    useEffect(() => {
        void _onRefresh();
        const timer = setInterval(() => void _onRefresh(), REFRESH_MS);

        return () => clearInterval(timer);
    }, [ _onRefresh ]);

    return (
        <div className = 'health'>
            <span className = { `health__dot health__dot--${status}` } />
            <span className = 'health__text'>
                {status === 'up' ? `API на связи · БД: ${db}` : null}
                {status === 'down' ? 'API недоступен' : null}
                {status === 'checking' ? 'Проверяю API…' : null}
            </span>
        </div>
    );
}
