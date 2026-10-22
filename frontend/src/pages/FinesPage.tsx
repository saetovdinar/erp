import { type ChangeEvent, useCallback, useState } from 'react';

import { Badge } from '../components/Badge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DataTable, type IColumn } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { RowActions } from '../components/RowActions';
import { SearchInput } from '../components/SearchInput';
import { FineForm } from '../forms/FineForm';
import { useCrud } from '../hooks/useCrud';
import { useLookup } from '../hooks/useLookup';
import { fineStatusLabel, fineStatusTone } from '../labels';
import { driverRepo, fineRepo, vehicleRepo } from '../mocks/repos';
import type { IDriver, IFine, IFineInput, IVehicle } from '../types/entities';
import { formatDate, formatMoney } from '../utils/format';

export function FinesPage() {
    const crud = useCrud(fineRepo);
    const drivers = useLookup<IDriver>(driverRepo);
    const vehicles = useLookup<IVehicle>(vehicleRepo);
    const [ creating, setCreating ] = useState(false);
    const [ deleting, setDeleting ] = useState<IFine | null>(null);
    const [ editing, setEditing ] = useState<IFine | null>(null);
    const [ formError, setFormError ] = useState<string | null>(null);
    const [ query, setQuery ] = useState('');

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
        await crud.remove(deleting.id);
        setDeleting(null);
    }, [ crud, deleting ]);

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
                await crud.update(editing.id, input);
            } else {
                await crud.create(input);
            }
            setCreating(false);
            setEditing(null);
            setFormError(null);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Не удалось сохранить');
        }
    }, [ crud, editing ]);

    const driverById = new Map(drivers.map(d => [ d.id, d ]));
    const vehicleById = new Map(vehicles.map(v => [ v.id, v ]));

    const q = query.trim().toLowerCase();
    const rows = crud.items.filter(f => {
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
            {crud.error ? <p className = 'banner banner--error'>{crud.error}</p> : null}
            <DataTable
                columns = { columns }
                emptyText = { q ? 'Ничего не найдено' : 'Штрафов пока нет' }
                loading = { crud.loading }
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
