import { type ChangeEvent, useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Badge } from '../../base/components/Badge';
import { ConfirmDialog } from '../../base/components/ConfirmDialog';
import { DataTable, type IColumn } from '../../base/components/DataTable';
import { Modal } from '../../base/components/Modal';
import { RowActions } from '../../base/components/RowActions';
import { SearchInput } from '../../base/components/SearchInput';
import { formatDate, formatMoney } from '../../base/utils/format';
import { loadDrivers } from '../../drivers/actions';
import { selectDrivers } from '../../drivers/selectors';
import { loadVehicles } from '../../vehicles/actions';
import { selectVehicles } from '../../vehicles/selectors';
import { createFine, loadFines, removeFine, updateFine } from '../actions';
import { fineStatusLabel, fineStatusTone } from '../constants';
import { selectFines, selectFinesError, selectFinesLoading } from '../selectors';
import type { IFine, IFineInput } from '../types';

import { FineForm } from './FineForm';

export function FinesPage() {
    const dispatch = useAppDispatch();
    const drivers = useAppSelector(selectDrivers);
    const error = useAppSelector(selectFinesError);
    const fines = useAppSelector(selectFines);
    const loading = useAppSelector(selectFinesLoading);
    const vehicles = useAppSelector(selectVehicles);
    const [ creating, setCreating ] = useState(false);
    const [ deleting, setDeleting ] = useState<IFine | null>(null);
    const [ editing, setEditing ] = useState<IFine | null>(null);
    const [ formError, setFormError ] = useState<string | null>(null);
    const [ query, setQuery ] = useState('');

    useEffect(() => {
        void dispatch(loadFines());
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

    const _onDelete = useCallback((fine: IFine) => {
        setDeleting(fine);
    }, []);

    const _onCancelDelete = useCallback(() => {
        setDeleting(null);
    }, []);

    const _onConfirmDelete = useCallback(async () => {
        if (!deleting) {
            return;
        }
        await dispatch(removeFine(deleting.id));
        setDeleting(null);
    }, [ deleting, dispatch ]);

    const _onEdit = useCallback((fine: IFine) => {
        setFormError(null);
        setEditing(fine);
    }, []);

    const _onQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const _onSubmit = useCallback(async (input: IFineInput) => {
        try {
            if (editing) {
                await dispatch(updateFine(editing.id, input));
            } else {
                await dispatch(createFine(input));
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
    const rows = fines.filter(f => {
        const vehicle = vehicleById.get(f.vehicleId);
        const driver = f.driverId ? driverById.get(f.driverId) : undefined;

        return f.article.toLowerCase().includes(q)
            || (vehicle ? `${vehicle.plate} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(q) : false)
            || (driver ? driver.fullName.toLowerCase().includes(q) : false);
    });

    const columns: Array<IColumn<IFine>> = [
        {
            key: 'date',
            render: f => formatDate(f.date),
            title: 'Дата'
        },
        {
            key: 'vehicleId',
            render: f => {
                const vehicle = vehicleById.get(f.vehicleId);

                return vehicle ? <strong>{vehicle.plate}</strong> : '—';
            },
            title: 'ТС'
        },
        {
            key: 'driverId',
            render: f => {
                const driver = f.driverId ? driverById.get(f.driverId) : undefined;

                return driver ? driver.fullName : '—';
            },
            title: 'Водитель'
        },
        {
            key: 'article',
            title: 'Статья / описание'
        },
        {
            key: 'amount',
            render: f => formatMoney(f.amount),
            title: 'Сумма'
        },
        {
            key: 'isPaid',
            render: f =>
                <Badge tone = { fineStatusTone(f.isPaid) }>{fineStatusLabel(f.isPaid)}</Badge>,
            title: 'Оплата'
        },
        {
            key: 'actions',
            render: f =>
                (<RowActions onDelete = { _onDelete }
                    onEdit = { _onEdit }
                    row = { f } />),
            title: ''
        }
    ];

    return (
        <section>
            <div className = 'page-head'>
                <h1 className = 'page-title'>Штрафы</h1>
                <div className = 'page-actions'>
                    <SearchInput
                        onChange = { _onQueryChange }
                        placeholder = 'Поиск: статья, ТС, водитель…'
                        value = { query } />
                    <button className = 'btn btn--primary'
                        onClick = { _onAdd }
                        type = 'button'>Добавить</button>
                </div>
            </div>
            {error ? <p className = 'banner banner--error'>{error}</p> : null}
            <DataTable
                columns = { columns }
                emptyText = { q ? 'Ничего не найдено' : 'Штрафов пока нет' }
                loading = { loading }
                rows = { rows } />
            {creating || editing ? (
                <Modal onClose = { _onCancelForm }
                    title = { editing ? 'Изменить штраф' : 'Новый штраф' }>
                    <FineForm
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
                    message = { `Удалить штраф от ${formatDate(deleting.date)} на ${formatMoney(deleting.amount)}?` }
                    onCancel = { _onCancelDelete }
                    onConfirm = { _onConfirmDelete }
                    title = 'Удаление штрафа' />
            ) : null}
        </section>
    );
}
