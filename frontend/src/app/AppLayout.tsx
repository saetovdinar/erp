import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { restoreSession } from '../features/auth/actions';
import { selectAuthStatus } from '../features/auth/selectors';

import { Sidebar } from './Sidebar';
import { useAppDispatch, useAppSelector } from './hooks';

/** Каркас панели (сайдбар + контент) — только для вошедших. */
export function AppLayout() {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectAuthStatus);

    useEffect(() => {
        if (status === 'checking') {
            void dispatch(restoreSession());
        }
    }, [ dispatch, status ]);

    if (status === 'out') {
        return (
            <Navigate
                replace = { true }
                to = '/login' />
        );
    }

    if (status === 'checking') {
        return (
            <div className = 'login'>
                <p className = 'login__hint'>Проверяю сессию…</p>
            </div>
        );
    }

    return (
        <div className = 'layout'>
            <Sidebar />
            <main className = 'content'>
                <Outlet />
            </main>
        </div>
    );
}
