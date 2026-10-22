import { Navigate, Route, Routes } from 'react-router-dom';

import { Sidebar } from './components/Sidebar';
import { BookingsPage } from './pages/BookingsPage';
import { DriversPage } from './pages/DriversPage';
import { FinesPage } from './pages/FinesPage';
import { VehiclesPage } from './pages/VehiclesPage';

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
