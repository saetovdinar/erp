import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { checkHealth } from '../actions';
import { selectHealthDb, selectHealthStatus } from '../selectors';

import styles from './health-indicator.module.css';

const REFRESH_MS = 5000;

/** Индикатор самочувствия API/БД в подвале меню (пинг /v1/health). */
export function HealthIndicator() {
    const dispatch = useAppDispatch();
    const db = useAppSelector(selectHealthDb);
    const status = useAppSelector(selectHealthStatus);

    useEffect(() => {
        void dispatch(checkHealth());
        const timer = setInterval(() => void dispatch(checkHealth()), REFRESH_MS);

        return () => clearInterval(timer);
    }, [ dispatch ]);

    return (
        <div className = { styles.root }>
            <span className = { `${styles.dot} ${styles[status]}` } />
            <span className = { styles.text }>
                {status === 'up' ? `API на связи · БД: ${db}` : null}
                {status === 'down' ? 'API недоступен' : null}
                {status === 'checking' ? 'Проверяю API…' : null}
            </span>
        </div>
    );
}
