import type { ReactNode } from 'react';

import styles from './data-table.module.css';

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
        return <p className = { styles.state }>Загрузка…</p>;
    }
    if (rows.length === 0) {
        return <p className = { styles.state }>{emptyText}</p>;
    }

    return (
        <div className = { styles.wrap }>
            <table className = { styles.table }>
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
                                (<td key = { col.key }>{col.render ? col.render(row)
                                    : String(row[col.key as keyof T] ?? '')}</td>)
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
