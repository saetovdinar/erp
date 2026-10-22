import { useCallback, useEffect, useState } from 'react';

import { type IHealthData, getHealth } from './api/client';
import './styles.css';

type Status = 'checking' | 'down' | 'up';

const REFRESH_MS = 5000;

interface IState {
    health: IHealthData | null;
    status: Status;
}

function statusText(state: IState): string {
    switch (state.status) {
    case 'up':
        return `API на связи · БД: ${state.health?.db ?? '—'} · ${state.health?.time ?? ''}`;
    case 'down':
        return 'API недоступен';
    default:
        return 'Проверяю…';
    }
}

// Заглушка каркаса: пингует /v1/health и показывает состояние API.
// Дизайн экранов — отдельный этап (не утверждать этот вид как целевой).
export function App() {
    const [ state, setState ] = useState<IState>({ health: null,
        status: 'checking' });

    const _onRefresh = useCallback(async () => {
        try {
            const health = await getHealth();

            setState({ health,
                status: 'up' });
        } catch {
            setState({ health: null,
                status: 'down' });
        }
    }, []);

    useEffect(() => {
        void _onRefresh();
        const timer = setInterval(() => void _onRefresh(), REFRESH_MS);

        return () => clearInterval(timer);
    }, [ _onRefresh ]);

    return (
        <main className = 'app'>
            <h1 className = 'app__title'>Мониторинг такси</h1>
            <p className = 'app__subtitle'>
                Каркас монорепо: React (webpack) + Express 5 + PostgreSQL
            </p>
            <section className = 'panel'>
                <span className = { `panel__dot panel__dot--${state.status}` } />
                <span className = 'panel__text'>{statusText(state)}</span>
                <button
                    className = 'panel__refresh'
                    onClick = { _onRefresh }>Обновить</button>
            </section>
        </main>
    );
}
