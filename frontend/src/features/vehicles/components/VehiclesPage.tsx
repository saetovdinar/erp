import { type ChangeEvent, useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Badge } from '../../base/components/Badge';
import { ConfirmDialog } from '../../base/components/ConfirmDialog';
import { DataTable, type IColumn } from '../../base/components/DataTable';
import { Modal } from '../../base/components/Modal';
import { RowActions } from '../../base/components/RowActions';
import { SearchInput } from '../../base/components/SearchInput';
import { createVehicle, loadVehicles, removeVehicle, updateVehicle } from '../actions';
import { vehicleStatusLabel, vehicleStatusTone, vehicleTypeLabel } from '../constants';
import { selectVehicles, selectVehiclesError, selectVehiclesLoading } from '../selectors';
import type { IVehicle, IVehicleInput } from '../types';

import { VehicleForm } from './VehicleForm';

export function VehiclesPage() {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectVehiclesError);
    const items = useAppSelector(selectVehicles);
    const loading = useAppSelector(selectVehiclesLoading);
    const [ creating, setCreating ] = useState(false);
    const [ deleting, setDeleting ] = useState<IVehicle | null>(null);
    const [ deleteError, setDeleteError ] = useState<string | null>(null);
    const [ editing, setEditing ] = useState<IVehicle | null>(null);
    const [ formError, setFormError ] = useState<string | null>(null);
    const [ query, setQuery ] = useState('');

    useEffect(() => {
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

    const _onCancelDelete = useCallback(() => {
        setDeleting(null);
        setDeleteError(null);
    }, []);

    const _onConfirmDelete = useCallback(async () => {
        if (!deleting) {
            return;
        }
        try {
            await dispatch(removeVehicle(deleting.id));
            setDeleting(null);
            setDeleteError(null);
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : 'Не удалось удалить');
        }
    }, [ deleting, dispatch ]);

    const _onDelete = useCallback((vehicle: IVehicle) => {
        setDeleteError(null);
        setDeleting(vehicle);
    }, []);

    const _onEdit = useCallback((vehicle: IVehicle) => {
        setFormError(null);
        setEditing(vehicle);
    }, []);

    const _onQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const _onSubmit = useCallback(async (input: IVehicleInput) => {
        try {
            if (editing) {
                await dispatch(updateVehicle(editing.id, input));
            } else {
                await dispatch(createVehicle(input));
            }
            setCreating(false);
            setEditing(null);
            setFormError(null);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Не удалось сохранить');
        }
    }, [ dispatch, editing ]);

    const q = query.trim().toLowerCase();
    const rows = items.filter(v => v.plate.toLowerCase().includes(q)
        || v.make.toLowerCase().includes(q)
        || v.model.toLowerCase().includes(q));

    const columns: Array<IColumn<IVehicle>> = [
        {
            key: 'plate',
            render: v => <strong>{v.plate}</strong>,
            title: 'Госномер'
        },
        {
            key: 'make',
            render: v => `${v.make} ${v.model}`,
            title: 'Марка и модель'
        },
        {
            key: 'vehicleType',
            render: v => vehicleTypeLabel[v.vehicleType],
            title: 'Тип'
        },
        {
            key: 'year',
            title: 'Год'
        },
        {
            key: 'mileage',
            render: v => `${v.mileage.toLocaleString('ru-RU')} км`,
            title: 'Пробег'
        },
        {
            key: 'status',
            render: v =>
                <Badge tone = { vehicleStatusTone[v.status] }>{vehicleStatusLabel[v.status]}</Badge>,
            title: 'Статус'
        },
        {
            key: 'actions',
            render: v =>
                (<RowActions onDelete = { _onDelete }
                    onEdit = { _onEdit }
                    row = { v } />),
            title: ''
        }
    ];

    return (
        <section>
            <div className = 'page-head'>
                <h1 className = 'page-title'>Транспортные средства</h1>
                <div className = 'page-actions'>
                    <SearchInput
                        onChange = { _onQueryChange }
                        placeholder = 'Поиск: номер, марка, модель…'
                        value = { query } />
                    <button className = 'btn btn--primary'
                        onClick = { _onAdd }
                        type = 'button'>Добавить</button>
                </div>
            </div>
            {error ? <p className = 'banner banner--error'>{error}</p> : null}
            <DataTable
                columns = { columns }
                emptyText = { q ? 'Ничего не найдено' : 'Транспортных средств пока нет' }
                loading = { loading }
                rows = { rows } />
            {creating || editing ? (
                <Modal onClose = { _onCancelForm }
                    title = { editing ? 'Изменить ТС' : 'Новое ТС' }>
                    <VehicleForm
                        error = { formError }
                        initial = { editing }
                        onCancel = { _onCancelForm }
                        onSubmit = { _onSubmit } />
                </Modal>
            ) : null}
            {deleting ? (
                <ConfirmDialog
                    error = { deleteError }
                    message = { `Удалить ТС ${deleting.plate} (${deleting.make} ${deleting.model})?` }
                    onCancel = { _onCancelDelete }
                    onConfirm = { _onConfirmDelete }
                    title = 'Удаление ТС' />
            ) : null}
        </section>
    );
}
