import { Navigate, Route, Routes } from 'react-router-dom';

import { LoginPage } from '../features/auth/components/LoginPage';
import { BookingsPage } from '../features/bookings/components/BookingsPage';
import { DriversPage } from '../features/drivers/components/DriversPage';
import { FinesPage } from '../features/fines/components/FinesPage';
import { VehiclesPage } from '../features/vehicles/components/VehiclesPage';

import { AppLayout } from './AppLayout';

export function App() {
    return (
        <Routes>
            <Route element = { <LoginPage /> }
                path = '/login' />
            <Route element = { <AppLayout /> }>
                <Route element = { <Navigate to = '/drivers' /> }
                    path = '/' />
                <Route element = { <DriversPage /> }
                    path = '/drivers' />
                <Route element = { <VehiclesPage /> }
                    path = '/vehicles' />
                <Route element = { <FinesPage /> }
                    path = '/fines' />
                <Route element = { <BookingsPage /> }
                    path = '/bookings' />
            </Route>
        </Routes>
    );
}
