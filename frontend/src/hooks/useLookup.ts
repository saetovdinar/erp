import { useEffect, useState } from 'react';

/** Одноразовая загрузка справочника (например, ТС для формы штрафа). */
export function useLookup<T extends { id: string; }>(repo: { list: () => Promise<T[]>; }): T[] {
    const [ items, setItems ] = useState<T[]>([]);

    useEffect(() => {
        let cancelled = false;

        void repo.list().then(data => {
            if (!cancelled) {
                setItems(data);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [ repo ]);

    return items;
}
