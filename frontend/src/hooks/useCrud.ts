import { useCallback, useEffect, useState } from 'react';

import type { ICrudRepo } from '../types/entities';

/** Список + CRUD поверх ICrudRepo: create/update/remove бросают ошибки наверх (в форму). */
export function useCrud<T extends { id: string; }, TInput>(repo: ICrudRepo<T, TInput>) {
    const [ error, setError ] = useState<string | null>(null);
    const [ items, setItems ] = useState<T[]>([]);
    const [ loading, setLoading ] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            setItems(await repo.list());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    }, [ repo ]);

    useEffect(() => {
        void refresh();
    }, [ refresh ]);

    const create = useCallback(async (input: TInput): Promise<T> => {
        const item = await repo.create(input);

        await refresh();

        return item;
    }, [ refresh, repo ]);

    const update = useCallback(async (id: string, input: TInput): Promise<T> => {
        const item = await repo.update(id, input);

        await refresh();

        return item;
    }, [ refresh, repo ]);

    const remove = useCallback(async (id: string): Promise<void> => {
        await repo.remove(id);
        await refresh();
    }, [ refresh, repo ]);

    return { create,
        error,
        items,
        loading,
        refresh,
        remove,
        update };
}
