import { type ChangeEvent, useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Badge } from '../../base/components/Badge';
import { ConfirmDialog } from '../../base/components/ConfirmDialog';
import { DataTable, type IColumn } from '../../base/components/DataTable';
import { Modal } from '../../base/components/Modal';
import { RowActions } from '../../base/components/RowActions';
import { SearchInput } from '../../base/components/SearchInput';
import { formatDate } from '../../base/utils/format';
import { createDriver, loadDrivers, removeDriver, updateDriver } from '../actions';
import { driverStatusLabel, driverStatusTone } from '../constants';
import { selectDrivers, selectDriversError, selectDriversLoading } from '../selectors';
import type { IDriver, IDriverInput } from '../types';

import { DriverForm } from './DriverForm';

export function DriversPage() {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectDriversError);
    const items = useAppSelector(selectDrivers);
    const loading = useAppSelector(selectDriversLoading);
    const [ creating, setCreating ] = useState(false);
    const [ deleting, setDeleting ] = useState<IDriver | null>(null);
    const [ deleteError, setDeleteError ] = useState<string | null>(null);
    const [ editing, setEditing ] = useState<IDriver | null>(null);
    const [ formError, setFormError ] = useState<string | null>(null);
    const [ query, setQuery ] = useState('');

    useEffect(() => {
        void dispatch(loadDrivers());
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
            await dispatch(removeDriver(deleting.id));
            setDeleting(null);
            setDeleteError(null);
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : 'Не удалось удалить');
        }
    }, [ deleting, dispatch ]);

    const _onDelete = useCallback((driver: IDriver) => {
        setDeleteError(null);
        setDeleting(driver);
    }, []);

    const _onEdit = useCallback((driver: IDriver) => {
        setFormError(null);
        setEditing(driver);
    }, []);

    const _onQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const _onSubmit = useCallback(async (input: IDriverInput) => {
        try {
            if (editing) {
                await dispatch(updateDriver(editing.id, input));
            } else {
                await dispatch(createDriver(input));
            }
            setCreating(false);
            setEditing(null);
            setFormError(null);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Не удалось сохранить');
        }
    }, [ dispatch, editing ]);

    const q = query.trim().toLowerCase();
    const rows = items.filter(d => d.fullName.toLowerCase().includes(q)
        || d.phone.toLowerCase().includes(q)
        || d.licenseNumber.toLowerCase().includes(q));

    const columns: Array<IColumn<IDriver>> = [
        {
            key: 'fullName',
            render: d => <strong>{d.fullName}</strong>,
            title: 'ФИО'
        },
        {
            key: 'phone',
            title: 'Телефон'
        },
        {
            key: 'licenseNumber',
            title: 'Удостоверение'
        },
        {
            key: 'experienceYears',
            render: d => `${d.experienceYears} лет`,
            title: 'Стаж'
        },
        {
            key: 'status',
            render: d =>
                <Badge tone = { driverStatusTone[d.status] }>{driverStatusLabel[d.status]}</Badge>,
            title: 'Статус'
        },
        {
            key: 'hiredAt',
            render: d => formatDate(d.hiredAt),
            title: 'Принят'
        },
        {
            key: 'actions',
            render: d =>
                (<RowActions onDelete = { _onDelete }
                    onEdit = { _onEdit }
                    row = { d } />),
            title: ''
        }
    ];

    return (
        <section>
            <div className = 'page-head'>
                <h1 className = 'page-title'>Водители</h1>
                <div className = 'page-actions'>
                    <SearchInput
                        onChange = { _onQueryChange }
                        placeholder = 'Поиск: ФИО, телефон, права…'
                        value = { query } />
                    <button className = 'btn btn--primary'
                        onClick = { _onAdd }
                        type = 'button'>Добавить</button>
                </div>
            </div>
            {error ? <p className = 'banner banner--error'>{error}</p> : null}
            <DataTable
                columns = { columns }
                emptyText = { q ? 'Ничего не найдено' : 'Водителей пока нет' }
                loading = { loading }
                rows = { rows } />
            {creating || editing ? (
                <Modal onClose = { _onCancelForm }
                    title = { editing ? 'Изменить водителя' : 'Новый водитель' }>
                    <DriverForm
                        error = { formError }
                        initial = { editing }
                        onCancel = { _onCancelForm }
                        onSubmit = { _onSubmit } />
                </Modal>
            ) : null}
            {deleting ? (
                <ConfirmDialog
                    error = { deleteError }
                    message = { `Удалить водителя «${deleting.fullName}»?` }
                    onCancel = { _onCancelDelete }
                    onConfirm = { _onConfirmDelete }
                    title = 'Удаление водителя' />
            ) : null}
        </section>
    );
}
