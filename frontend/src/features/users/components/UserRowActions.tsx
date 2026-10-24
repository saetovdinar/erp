import { useCallback } from 'react';

import type { IUserAccount } from '../types';

import styles from './UserRowActions.module.css';

interface IProps {
    onDelete: (row: IUserAccount) => void;
    onReset: (row: IUserAccount) => void;
    row: IUserAccount;
}

/** Действия строки учёток: сброс пароля и удаление (логин не меняется). */
export function UserRowActions({ onDelete, onReset, row }: IProps) {
    const _onDeleteClick = useCallback(() => {
        onDelete(row);
    }, [ onDelete, row ]);

    const _onResetClick = useCallback(() => {
        onReset(row);
    }, [ onReset, row ]);

    return (
        <div className = { styles.actions }>
            <button className = 'btn btn--ghost'
                onClick = { _onResetClick }
                type = 'button'>Сброс пароля</button>
            <button className = 'btn btn--ghost btn--danger-text'
                onClick = { _onDeleteClick }
                type = 'button'>
                Удалить
            </button>
        </div>
    );
}
