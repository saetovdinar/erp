import { type ChangeEvent, type FormEvent, useCallback, useState } from 'react';

import { vehicleStatusLabel, vehicleTypeLabel } from '../constants';
import type { IVehicle, IVehicleInput, VehicleStatus, VehicleType } from '../types';

interface IProps {
    error: string | null;
    initial: IVehicle | null;
    onCancel: () => void;
    onSubmit: (input: IVehicleInput) => Promise<void>;
}

export function VehicleForm({ error, initial, onCancel, onSubmit }: IProps) {
    const [ localError, setLocalError ] = useState<string | null>(null);
    const [ make, setMake ] = useState(initial?.make ?? '');
    const [ mileage, setMileage ] = useState(String(initial?.mileage ?? ''));
    const [ model, setModel ] = useState(initial?.model ?? '');
    const [ plate, setPlate ] = useState(initial?.plate ?? '');
    const [ status, setStatus ] = useState<VehicleStatus>(initial?.status ?? 'active');
    const [ vehicleType, setVehicleType ] = useState<VehicleType>(initial?.vehicleType ?? 'sedan');
    const [ year, setYear ] = useState(String(initial?.year ?? ''));

    const _onFieldChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        switch (name) {
        case 'plate':
            setPlate(value);
            break;
        case 'make':
            setMake(value);
            break;
        case 'model':
            setModel(value);
            break;
        case 'vehicleType':
            setVehicleType(value as VehicleType);
            break;
        case 'year':
            setYear(value);
            break;
        case 'mileage':
            setMileage(value);
            break;
        case 'status':
            setStatus(value as VehicleStatus);
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

        const mileageNum = Number(mileage);
        const yearNum = Number(year);

        if (!plate.trim() || !make.trim() || !model.trim() || !year) {
            setLocalError('Заполните все обязательные поля');

            return;
        }
        if (!Number.isFinite(yearNum) || yearNum < 1950 || yearNum > 2100) {
            setLocalError('Год выпуска — от 1950 до 2100');

            return;
        }
        if (!Number.isFinite(mileageNum) || mileageNum < 0) {
            setLocalError('Пробег — неотрицательное число');

            return;
        }
        void onSubmit({
            make: make.trim(),
            mileage: mileageNum,
            model: model.trim(),
            plate: plate.trim(),
            status,
            vehicleType,
            year: yearNum
        });
    }, [ make, mileage, model, onSubmit, plate, status, vehicleType, year ]);

    return (
        <form className = 'form'
            onSubmit = { _onSubmit }>
            {error || localError ? <p className = 'banner banner--error'>{error ?? localError}</p> : null}
            <label className = 'field'>
                <span className = 'field__label'>Госномер *</span>
                <input
                    name = 'plate'
                    onChange = { _onFieldChange }
                    placeholder = 'А123ВС16'
                    required = { true }
                    value = { plate } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Марка *</span>
                <input
                    name = 'make'
                    onChange = { _onFieldChange }
                    required = { true }
                    value = { make } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Модель *</span>
                <input
                    name = 'model'
                    onChange = { _onFieldChange }
                    required = { true }
                    value = { model } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Тип</span>
                <select name = 'vehicleType'
                    onChange = { _onFieldChange }
                    value = { vehicleType }>
                    {Object.entries(vehicleTypeLabel).map(([ value, label ]) =>
                        (<option key = { value }
                            value = { value }>{label}</option>)
                    )}
                </select>
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Год выпуска *</span>
                <input
                    max = { 2100 }
                    min = { 1950 }
                    name = 'year'
                    onChange = { _onFieldChange }
                    required = { true }
                    type = 'number'
                    value = { year } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Пробег, км</span>
                <input
                    min = { 0 }
                    name = 'mileage'
                    onChange = { _onFieldChange }
                    type = 'number'
                    value = { mileage } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Статус</span>
                <select name = 'status'
                    onChange = { _onFieldChange }
                    value = { status }>
                    {Object.entries(vehicleStatusLabel).map(([ value, label ]) =>
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
