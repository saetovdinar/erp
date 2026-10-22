import type { ReactNode } from 'react';

export interface IColumn<T> {
    key: string;
    render?: (row: T) => ReactNode;
    title: string;
}

interface IProps<T extends { id: string; }> {
    columns: Array<IColumn<T>>;
    emptyText: string;
    loading: boolean;
    rows: T[];
}

export function DataTable<T extends { id: string; }>({ columns, emptyText, loading, rows }: IProps<T>) {
    if (loading) {
        return <p className = 'table-state'>Загрузка…</p>;
    }
    if (rows.length === 0) {
        return <p className = 'table-state'>{emptyText}</p>;
    }

    return (
        <div className = 'table-wrap'>
            <table className = 'table'>
                <thead>
                    <tr>
                        {columns.map(col =>
                            <th key = { col.key }>{col.title}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key = { row.id }>
                            {columns.map(col =>
                                <td key = { col.key }>{col.render ? col.render(row) : null}</td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
