import { useCallback, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { restoreSession } from '../features/auth/actions';
import { selectAuthStatus } from '../features/auth/selectors';

import { Sidebar } from './Sidebar';
import styles from './app-layout.module.css';
import { useAppDispatch, useAppSelector } from './hooks';

/** Каркас панели (сайдбар + контент) — только для вошедших. */
export function AppLayout() {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectAuthStatus);

    // открыт ли сайдбар-drawer (актуально только до 900px)
    const [ navOpen, setNavOpen ] = useState(false);

    useEffect(() => {
        if (status === 'checking') {
            void dispatch(restoreSession());
        }
    }, [ dispatch, status ]);

    const _onCloseNav = useCallback(() => {
        setNavOpen(false);
    }, []);

    const _onOpenNav = useCallback(() => {
        setNavOpen(true);
    }, []);

    if (status === 'out') {
        return (
            <Navigate
                replace = { true }
                to = '/login' />
        );
    }

    if (status === 'checking') {
        return (
            <div className = { styles.session }>
                <p className = { styles.sessionHint }>Проверяю сессию…</p>
            </div>
        );
    }

    return (
        <div className = { styles.layout }>
            <Sidebar onClose = { _onCloseNav }
                open = { navOpen } />
            {navOpen ? (
                <div
                    className = { styles.backdrop }
                    onClick = { _onCloseNav } />
            ) : null}
            <div className = { styles.main }>
                <header className = { styles.topbar }>
                    <button
                        aria-expanded = { navOpen }
                        aria-label = 'Меню'
                        className = { `btn ${styles.topbarToggle}` }
                        onClick = { _onOpenNav }
                        type = 'button'>☰</button>
                    <span className = { styles.topbarBrand }>ERP · Такси</span>
                </header>
                <main className = { styles.content }>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
