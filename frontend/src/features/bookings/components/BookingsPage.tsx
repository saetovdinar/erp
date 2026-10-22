import { type ChangeEvent, useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Badge } from '../../base/components/Badge';
import { ConfirmDialog } from '../../base/components/ConfirmDialog';
import { DataTable, type IColumn } from '../../base/components/DataTable';
import { Modal } from '../../base/components/Modal';
import { RowActions } from '../../base/components/RowActions';
import { SearchInput } from '../../base/components/SearchInput';
import { formatDateTime } from '../../base/utils/format';
import { loadDrivers } from '../../drivers/actions';
import { selectDrivers } from '../../drivers/selectors';
import { loadVehicles } from '../../vehicles/actions';
import { selectVehicles } from '../../vehicles/selectors';
import { createBooking, loadBookings, removeBooking, updateBooking } from '../actions';
import { bookingStatusLabel, bookingStatusTone } from '../constants';
import { selectBookings, selectBookingsError, selectBookingsLoading } from '../selectors';
import type { IBooking, IBookingInput } from '../types';

import { BookingForm } from './BookingForm';

export function BookingsPage() {
    const dispatch = useAppDispatch();
    const bookings = useAppSelector(selectBookings);
    const drivers = useAppSelector(selectDrivers);
    const error = useAppSelector(selectBookingsError);
    const loading = useAppSelector(selectBookingsLoading);
    const vehicles = useAppSelector(selectVehicles);
    const [ creating, setCreating ] = useState(false);
    const [ deleting, setDeleting ] = useState<IBooking | null>(null);
    const [ editing, setEditing ] = useState<IBooking | null>(null);
    const [ formError, setFormError ] = useState<string | null>(null);
    const [ query, setQuery ] = useState('');

    useEffect(() => {
        void dispatch(loadBookings());
        void dispatch(loadDrivers());
        void dispatch(loadVehicles());
    }, [ dispatch ]);

    const _onAdd = useCallback(() => {
        setFormError(null);
        setCreating(true);
    }, []);

    const _onCancelForm = useCallback(() => {
        setCreating(false);
        setEditing(null);
        setFormError(null);
    }, []);

    const _onDelete = useCallback((booking: IBooking) => {
        setDeleting(booking);
    }, []);

    const _onCancelDelete = useCallback(() => {
        setDeleting(null);
    }, []);

    const _onConfirmDelete = useCallback(async () => {
        if (!deleting) {
            return;
        }
        await dispatch(removeBooking(deleting.id));
        setDeleting(null);
    }, [ deleting, dispatch ]);

    const _onEdit = useCallback((booking: IBooking) => {
        setFormError(null);
        setEditing(booking);
    }, []);

    const _onQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const _onSubmit = useCallback(async (input: IBookingInput) => {
        try {
            if (editing) {
                await dispatch(updateBooking(editing.id, input));
            } else {
                await dispatch(createBooking(input));
            }
            setCreating(false);
            setEditing(null);
            setFormError(null);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Не удалось сохранить');
        }
    }, [ dispatch, editing ]);

    const driverById = new Map(drivers.map(d => [ d.id, d ]));
    const vehicleById = new Map(vehicles.map(v => [ v.id, v ]));

    const q = query.trim().toLowerCase();
    const rows = bookings.filter(b => {
        const vehicle = vehicleById.get(b.vehicleId);
        const driver = driverById.get(b.driverId);

        return b.purpose.toLowerCase().includes(q)
            || (vehicle ? `${vehicle.plate} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(q) : false)
            || (driver ? driver.fullName.toLowerCase().includes(q) : false);
    });

    const columns: Array<IColumn<IBooking>> = [
        {
            key: 'vehicleId',
            render: b => {
                const vehicle = vehicleById.get(b.vehicleId);

                return vehicle ? <strong>{vehicle.plate}</strong> : '—';
            },
            title: 'ТС'
        },
        {
            key: 'driverId',
            render: b => {
                const driver = driverById.get(b.driverId);

                return driver ? driver.fullName : '—';
            },
            title: 'Водитель'
        },
        {
            key: 'period',
            render: b => `${formatDateTime(b.startsAt)} — ${formatDateTime(b.endsAt)}`,
            title: 'Период'
        },
        {
            key: 'purpose',
            title: 'Цель'
        },
        {
            key: 'status',
            render: b =>
                <Badge tone = { bookingStatusTone[b.status] }>{bookingStatusLabel[b.status]}</Badge>,
            title: 'Статус'
        },
        {
            key: 'actions',
            render: b =>
                (<RowActions onDelete = { _onDelete }
                    onEdit = { _onEdit }
                    row = { b } />),
            title: ''
        }
    ];

    return (
        <section>
            <div className = 'page-head'>
                <h1 className = 'page-title'>Бронирование ТС</h1>
                <div className = 'page-actions'>
                    <SearchInput
                        onChange = { _onQueryChange }
                        placeholder = 'Поиск: цель, ТС, водитель…'
                        value = { query } />
                    <button className = 'btn btn--primary'
                        onClick = { _onAdd }
                        type = 'button'>Добавить</button>
                </div>
            </div>
            {error ? <p className = 'banner banner--error'>{error}</p> : null}
            <DataTable
                columns = { columns }
                emptyText = { q ? 'Ничего не найдено' : 'Бронирований пока нет' }
                loading = { loading }
                rows = { rows } />
            {creating || editing ? (
                <Modal onClose = { _onCancelForm }
                    title = { editing ? 'Изменить бронирование' : 'Новое бронирование' }>
                    <BookingForm
                        drivers = { drivers }
                        error = { formError }
                        initial = { editing }
                        onCancel = { _onCancelForm }
                        onSubmit = { _onSubmit }
                        vehicles = { vehicles } />
                </Modal>
            ) : null}
            {deleting ? (
                <ConfirmDialog
                    error = { null }
                    message = { `Удалить бронирование «${deleting.purpose}»?` }
                    onCancel = { _onCancelDelete }
                    onConfirm = { _onConfirmDelete }
                    title = 'Удаление бронирования' />
            ) : null}
        </section>
    );
}
