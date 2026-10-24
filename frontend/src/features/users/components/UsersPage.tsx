import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Badge } from '../../base/components/Badge';
import { ConfirmDialog } from '../../base/components/ConfirmDialog';
import { DataTable, type IColumn } from '../../base/components/DataTable';
import { Modal } from '../../base/components/Modal';
import { createUser, loadUsers, removeUser, resetUserPassword } from '../actions';
import { userRoleLabel, userRoleTone } from '../constants';
import { selectUsers, selectUsersError, selectUsersLoading } from '../selectors';
import type { IUserAccount, IUserCreateInput } from '../types';

import { ResetPasswordForm } from './ResetPasswordForm';
import { UserForm } from './UserForm';
import { UserRowActions } from './UserRowActions';

/** Раздел администратора: учётки панели — создание, сброс пароля, удаление. */
export function UsersPage() {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectUsersError);
    const items = useAppSelector(selectUsers);
    const loading = useAppSelector(selectUsersLoading);
    const [ creating, setCreating ] = useState(false);
    const [ deleting, setDeleting ] = useState<IUserAccount | null>(null);
    const [ deleteError, setDeleteError ] = useState<string | null>(null);
    const [ formError, setFormError ] = useState<string | null>(null);
    const [ resetError, setResetError ] = useState<string | null>(null);
    const [ resetting, setResetting ] = useState<IUserAccount | null>(null);

    useEffect(() => {
        void dispatch(loadUsers());
    }, [ dispatch ]);

    const _onAdd = useCallback(() => {
        setFormError(null);
        setCreating(true);
    }, []);

    const _onCancelCreate = useCallback(() => {
        setCreating(false);
        setFormError(null);
    }, []);

    const _onCancelDelete = useCallback(() => {
        setDeleting(null);
        setDeleteError(null);
    }, []);

    const _onCancelReset = useCallback(() => {
        setResetError(null);
        setResetting(null);
    }, []);

    const _onConfirmDelete = useCallback(async () => {
        if (!deleting) {
            return;
        }
        try {
            await dispatch(removeUser(deleting.id));
            setDeleting(null);
            setDeleteError(null);
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : 'Не удалось удалить');
        }
    }, [ deleting, dispatch ]);

    const _onDelete = useCallback((user: IUserAccount) => {
        setDeleteError(null);
        setDeleting(user);
    }, []);

    const _onReset = useCallback((user: IUserAccount) => {
        setResetError(null);
        setResetting(user);
    }, []);

    const _onSubmitCreate = useCallback(async (input: IUserCreateInput) => {
        try {
            await dispatch(createUser(input));
            setCreating(false);
            setFormError(null);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Не удалось сохранить');
        }
    }, [ dispatch ]);

    const _onSubmitReset = useCallback(async (password: string) => {
        if (!resetting) {
            return;
        }
        try {
            await dispatch(resetUserPassword(resetting.id, password));
            setResetError(null);
            setResetting(null);
        } catch (err) {
            setResetError(err instanceof Error ? err.message : 'Не удалось сохранить');
        }
    }, [ dispatch, resetting ]);

    const columns: Array<IColumn<IUserAccount>> = [
        {
            key: 'login',
            render: u => <strong>{u.login}</strong>,
            title: 'Логин'
        },
        {
            key: 'role',
            render: u =>
                <Badge tone = { userRoleTone[u.role] }>{userRoleLabel[u.role]}</Badge>,
            title: 'Роль'
        },
        {
            key: 'createdAt',
            title: 'Создана'
        },
        {
            key: 'actions',
            render: u =>
                (<UserRowActions onDelete = { _onDelete }
                    onReset = { _onReset }
                    row = { u } />),
            title: ''
        }
    ];

    return (
        <section>
            <div className = 'page-head'>
                <h1 className = 'page-title'>Пользователи</h1>
                <div className = 'page-actions'>
                    <button className = 'btn btn--primary'
                        onClick = { _onAdd }
                        type = 'button'>Создать учётку</button>
                </div>
            </div>
            {error ? <p className = 'banner banner--error'>{error}</p> : null}
            <DataTable
                columns = { columns }
                emptyText = 'Учёток пока нет'
                loading = { loading }
                rows = { items } />
            {creating ? (
                <Modal onClose = { _onCancelCreate }
                    title = 'Новая учётка'>
                    <UserForm
                        error = { formError }
                        onCancel = { _onCancelCreate }
                        onSubmit = { _onSubmitCreate } />
                </Modal>
            ) : null}
            {resetting ? (
                <Modal onClose = { _onCancelReset }
                    title = { `Сброс пароля: ${resetting.login}` }>
                    <ResetPasswordForm
                        error = { resetError }
                        onCancel = { _onCancelReset }
                        onSubmit = { _onSubmitReset }
                        user = { resetting } />
                </Modal>
            ) : null}
            {deleting ? (
                <ConfirmDialog
                    error = { deleteError }
                    message = { `Удалить учётку «${deleting.login}» вместе со всеми её данными?` }
                    onCancel = { _onCancelDelete }
                    onConfirm = { _onConfirmDelete }
                    title = 'Удаление учётки' />
            ) : null}
        </section>
    );
}
