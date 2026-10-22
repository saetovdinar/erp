import { type ChangeEvent, type FormEvent, useCallback, useState } from 'react';

import type { IDriver } from '../../drivers/types';
import type { IVehicle } from '../../vehicles/types';
import { bookingStatusLabel } from '../constants';
import type { IBooking, IBookingInput } from '../types';

interface IProps {
    drivers: IDriver[];
    error: string | null;
    initial: IBooking | null;
    onCancel: () => void;
    onSubmit: (input: IBookingInput) => Promise<void>;
    vehicles: IVehicle[];
}

export function BookingForm({ drivers, error, initial, onCancel, onSubmit, vehicles }: IProps) {
    const [ driverId, setDriverId ] = useState(initial?.driverId ?? '');
    const [ endsAt, setEndsAt ] = useState(initial?.endsAt ?? '');
    const [ localError, setLocalError ] = useState<string | null>(null);
    const [ purpose, setPurpose ] = useState(initial?.purpose ?? '');
    const [ startsAt, setStartsAt ] = useState(initial?.startsAt ?? '');
    const [ status, setStatus ] = useState<IBookingInput['status']>(initial?.status ?? 'planned');
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
        case 'startsAt':
            setStartsAt(value);
            break;
        case 'endsAt':
            setEndsAt(value);
            break;
        case 'purpose':
            setPurpose(value);
            break;
        case 'status':
            setStatus(value as IBookingInput['status']);
            break;
        default:
            break;
        }
    }, []);

    const _onCancelClick = useCallback(() => {
        onCancel();
    }, [ onCancel ]);

    const _onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError(null);

        if (!vehicleId || !driverId || !startsAt || !endsAt || !purpose.trim()) {
            setLocalError('Заполните все обязательные поля');

            return;
        }
        if (startsAt >= endsAt) {
            setLocalError('Окончание должно быть позже начала');

            return;
        }
        void onSubmit({
            driverId,
            endsAt,
            purpose: purpose.trim(),
            startsAt,
            status,
            vehicleId
        });
    }, [ driverId, endsAt, onSubmit, purpose, startsAt, status, vehicleId ]);

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
                <span className = 'field__label'>Водитель *</span>
                <select name = 'driverId'
                    onChange = { _onFieldChange }
                    required = { true }
                    value = { driverId }>
                    <option value = ''>— выберите водителя —</option>
                    {drivers.map(d =>
                        (<option key = { d.id }
                            value = { d.id }>{d.fullName}</option>)
                    )}
                </select>
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Начало *</span>
                <input
                    name = 'startsAt'
                    onChange = { _onFieldChange }
                    required = { true }
                    type = 'datetime-local'
                    value = { startsAt } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Окончание *</span>
                <input
                    name = 'endsAt'
                    onChange = { _onFieldChange }
                    required = { true }
                    type = 'datetime-local'
                    value = { endsAt } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Цель *</span>
                <input
                    name = 'purpose'
                    onChange = { _onFieldChange }
                    placeholder = 'Смена в аэропорт'
                    required = { true }
                    value = { purpose } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Статус</span>
                <select name = 'status'
                    onChange = { _onFieldChange }
                    value = { status }>
                    {Object.entries(bookingStatusLabel).map(([ value, label ]) =>
                        (<option key = { value }
                            value = { value }>{label}</option>)
                    )}
                </select>
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
