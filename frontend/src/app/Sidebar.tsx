import { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { authLogout } from '../features/auth/actions';
import { selectAuthUser } from '../features/auth/selectors';
import { HealthIndicator } from '../features/health/components/HealthIndicator';

import styles from './sidebar.module.css';

const NAV_ITEMS = [
    { path: '/drivers',
        title: 'Водители' },
    { path: '/vehicles',
        title: 'Транспортные средства' },
    { path: '/fines',
        title: 'Штрафы' },
    { path: '/bookings',
        title: 'Бронирование ТС' }
];

// управление учётками — только админу (изоляция: данные каждого — свои)
const ADMIN_NAV_ITEM = { path: '/users',
    title: 'Пользователи' };

interface IProps {
    onClose: () => void;
    open: boolean;
}

// именованная функция вместо inline-стрелки — правило react/jsx-no-bind
function navLinkClassName({ isActive }: { isActive: boolean; }): string {
    return `${styles.navLink}${isActive ? ` ${styles.navLinkActive}` : ''}`;
}

export function Sidebar({ onClose, open }: IProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectAuthUser);

    const _onLogoutClick = useCallback(() => {
        dispatch(authLogout());
        navigate('/login');
    }, [ dispatch, navigate ]);

    const _onPasswordClick = useCallback(() => {
        onClose();
        navigate('/password');
    }, [ navigate, onClose ]);

    const items = user?.role === 'admin' ? [ ...NAV_ITEMS, ADMIN_NAV_ITEM ] : NAV_ITEMS;

    return (
        <aside className = { `${styles.root}${open ? ` ${styles.open}` : ''}` }>
            <div className = { styles.brand }>ERP · Такси</div>
            <nav className = { styles.nav }>
                {items.map(item => (
                    <NavLink
                        className = { navLinkClassName }
                        key = { item.path }
                        onClick = { onClose }
                        to = { item.path }>
                        {item.title}
                    </NavLink>
                ))}
            </nav>
            <div className = { styles.user }>
                <span className = { styles.login }>{user?.login ?? ''}</span>
                <div className = { styles.userActions }>
                    <button className = 'btn'
                        onClick = { _onPasswordClick }
                        type = 'button'>Пароль</button>
                    <button className = 'btn'
                        onClick = { _onLogoutClick }
                        type = 'button'>Выйти</button>
                </div>
            </div>
            <HealthIndicator />
        </aside>
    );
}
