import { Navigate, Route, Routes } from 'react-router-dom';

import { BookingsPage } from '../features/bookings/components/BookingsPage';
import { DriversPage } from '../features/drivers/components/DriversPage';
import { FinesPage } from '../features/fines/components/FinesPage';
import { VehiclesPage } from '../features/vehicles/components/VehiclesPage';

import { Sidebar } from './Sidebar';

export function App() {
    return (
        <div className = 'layout'>
            <Sidebar />
            <main className = 'content'>
                <Routes>
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
                </Routes>
            </main>
        </div>
    );
}
