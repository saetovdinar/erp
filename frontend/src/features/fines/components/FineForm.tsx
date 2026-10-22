import { type ChangeEvent, type FormEvent, useCallback, useState } from 'react';

import type { IDriver } from '../../drivers/types';
import type { IVehicle } from '../../vehicles/types';
import type { IFine, IFineInput } from '../types';

interface IProps {
    drivers: IDriver[];
    error: string | null;
    initial: IFine | null;
    onCancel: () => void;
    onSubmit: (input: IFineInput) => Promise<void>;
    vehicles: IVehicle[];
}

export function FineForm({ drivers, error, initial, onCancel, onSubmit, vehicles }: IProps) {
    const [ amount, setAmount ] = useState(String(initial?.amount ?? ''));
    const [ article, setArticle ] = useState(initial?.article ?? '');
    const [ date, setDate ] = useState(initial?.date.slice(0, 10) ?? '');
    const [ driverId, setDriverId ] = useState(initial?.driverId ?? '');
    const [ isPaid, setIsPaid ] = useState(initial?.isPaid ?? false);
    const [ localError, setLocalError ] = useState<string | null>(null);
    const [ vehicleId, setVehicleId ] = useState(initial?.vehicleId ?? '');

    const _onFieldChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        switch (name) {
        case 'vehicleId':
            setVehicleId(value);
            break;
        case 'driverId':
            setDriverId(value);
            break;
        case 'date':
            setDate(value);
            break;
        case 'article':
            setArticle(value);
            break;
        case 'amount':
            setAmount(value);
            break;
        default:
            break;
        }
    }, []);

    const _onPaidChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setIsPaid(e.target.checked);
    }, []);

    const _onCancelClick = useCallback(() => {
        onCancel();
    }, [ onCancel ]);

    const _onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError(null);

        const amountNum = Number(amount);

        if (!vehicleId || !date || !article.trim() || !amount) {
            setLocalError('Заполните все обязательные поля (водитель — по желанию)');

            return;
        }
        if (!Number.isFinite(amountNum) || amountNum <= 0) {
            setLocalError('Сумма — положительное число');

            return;
        }
        void onSubmit({
            amount: amountNum,
            article: article.trim(),
            date,
            driverId: driverId || null,
            isPaid,
            vehicleId
        });
    }, [ amount, article, date, driverId, isPaid, onSubmit, vehicleId ]);

    return (
        <form className = 'form'
            onSubmit = { _onSubmit }>
            {error || localError ? <p className = 'banner banner--error'>{error ?? localError}</p> : null}
            <label className = 'field'>
                <span className = 'field__label'>Транспортное средство *</span>
                <select name = 'vehicleId'
                    onChange = { _onFieldChange }
                    required = { true }
                    value = { vehicleId }>
                    <option value = ''>— выберите ТС —</option>
                    {vehicles.map(v =>
                        (<option key = { v.id }
                            value = { v.id }>{`${v.plate} · ${v.make} ${v.model}`}</option>)
                    )}
                </select>
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Водитель</span>
                <select name = 'driverId'
                    onChange = { _onFieldChange }
                    value = { driverId }>
                    <option value = ''>— не указан —</option>
                    {drivers.map(d =>
                        (<option key = { d.id }
                            value = { d.id }>{d.fullName}</option>)
                    )}
                </select>
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Дата нарушения *</span>
                <input
                    name = 'date'
                    onChange = { _onFieldChange }
                    required = { true }
                    type = 'date'
                    value = { date } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Статья / описание *</span>
                <input
                    name = 'article'
                    onChange = { _onFieldChange }
                    placeholder = '12.9 ч.2 — превышение на 20–40 км/ч'
                    required = { true }
                    value = { article } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Сумма, ₽ *</span>
                <input
                    min = { 1 }
                    name = 'amount'
                    onChange = { _onFieldChange }
                    required = { true }
                    type = 'number'
                    value = { amount } />
            </label>
            <label className = 'field field--inline'>
                <input checked = { isPaid }
                    name = 'isPaid'
                    onChange = { _onPaidChange }
                    type = 'checkbox' />
                <span className = 'field__label'>Оплачен</span>
            </label>
            <div className = 'form__actions'>
                <button className = 'btn'
                    onClick = { _onCancelClick }
                    type = 'button'>Отмена</button>
                <button className = 'btn btn--primary'
                    type = 'submit'>Сохранить</button>
            </div>
        </form>
    );
}
