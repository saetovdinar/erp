import { useCallback } from 'react';

interface IProps<T> {
    onDelete: (row: T) => void;
    onEdit: (row: T) => void;
    row: T;
}

/** Действия строки таблицы: связка row со стабильными хендлерами через useCallback. */
export function RowActions<T>({ onDelete, onEdit, row }: IProps<T>) {
    const _onDeleteClick = useCallback(() => {
        onDelete(row);
    }, [ onDelete, row ]);

    const _onEditClick = useCallback(() => {
        onEdit(row);
    }, [ onEdit, row ]);

    return (
        <div className = 'row-actions'>
            <button className = 'btn btn--ghost'
                onClick = { _onEditClick }
                type = 'button'>Изменить</button>
            <button className = 'btn btn--ghost btn--danger-text'
                onClick = { _onDeleteClick }
                type = 'button'>
                Удалить
            </button>
        </div>
    );
}
