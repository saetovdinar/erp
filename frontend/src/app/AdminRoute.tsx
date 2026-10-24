import { Navigate, Outlet } from 'react-router-dom';

import { selectAuthUser } from '../features/auth/selectors';

import { useAppSelector } from './hooks';

/** Вложенные роуты — только админу; остальных — к данным. */
export function AdminRoute() {
    const user = useAppSelector(selectAuthUser);

    if (user?.role !== 'admin') {
        return (
            <Navigate
                replace = { true }
                to = '/drivers' />
        );
    }

    return <Outlet />;
}
