import { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { authLogout } from '../features/auth/actions';
import { selectAuthUser } from '../features/auth/selectors';
import { HealthIndicator } from '../features/health/components/HealthIndicator';

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

// именованная функция вместо inline-стрелки — правило react/jsx-no-bind
function navLinkClassName({ isActive }: { isActive: boolean; }): string {
    return `nav-link${isActive ? ' nav-link--active' : ''}`;
}

export function Sidebar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectAuthUser);

    const _onLogoutClick = useCallback(() => {
        dispatch(authLogout());
        navigate('/login');
    }, [ dispatch, navigate ]);

    return (
        <aside className = 'sidebar'>
            <div className = 'sidebar__brand'>ERP · Такси</div>
            <nav className = 'sidebar__nav'>
                {NAV_ITEMS.map(item => (
                    <NavLink
                        className = { navLinkClassName }
                        key = { item.path }
                        to = { item.path }>
                        {item.title}
                    </NavLink>
                ))}
            </nav>
            <div className = 'sidebar__user'>
                <span className = 'sidebar__login'>{user?.login ?? ''}</span>
                <button className = 'btn'
                    onClick = { _onLogoutClick }
                    type = 'button'>Выйти</button>
            </div>
            <HealthIndicator />
        </aside>
    );
}
