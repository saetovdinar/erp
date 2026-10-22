import { NavLink } from 'react-router-dom';

import { HealthIndicator } from './HealthIndicator';

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
            <HealthIndicator />
        </aside>
    );
}
