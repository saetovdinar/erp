import { type ChangeEvent, type FormEvent, useCallback, useState } from 'react';

import { driverStatusLabel } from '../constants';
import type { DriverStatus, IDriver, IDriverInput } from '../types';

interface IProps {
    error: string | null;
    initial: IDriver | null;
    onCancel: () => void;
    onSubmit: (input: IDriverInput) => Promise<void>;
}

export function DriverForm({ error, initial, onCancel, onSubmit }: IProps) {
    const [ experienceYears, setExperienceYears ] = useState(String(initial?.experienceYears ?? ''));
    const [ fullName, setFullName ] = useState(initial?.fullName ?? '');
    const [ hiredAt, setHiredAt ] = useState(initial?.hiredAt.slice(0, 10) ?? '');
    const [ licenseNumber, setLicenseNumber ] = useState(initial?.licenseNumber ?? '');
    const [ localError, setLocalError ] = useState<string | null>(null);
    const [ phone, setPhone ] = useState(initial?.phone ?? '');
    const [ status, setStatus ] = useState<DriverStatus>(initial?.status ?? 'active');

    const _onFieldChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        switch (name) {
        case 'fullName':
            setFullName(value);
            break;
        case 'phone':
            setPhone(value);
            break;
        case 'licenseNumber':
            setLicenseNumber(value);
            break;
        case 'experienceYears':
            setExperienceYears(value);
            break;
        case 'status':
            setStatus(value as DriverStatus);
            break;
        case 'hiredAt':
            setHiredAt(value);
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

        const years = Number(experienceYears);

        if (!fullName.trim() || !phone.trim() || !licenseNumber.trim() || !hiredAt) {
            setLocalError('Заполните все обязательные поля');

            return;
        }
        if (!Number.isFinite(years) || years < 0) {
            setLocalError('Стаж — неотрицательное число');

            return;
        }
        void onSubmit({
            experienceYears: years,
            fullName: fullName.trim(),
            hiredAt,
            licenseNumber: licenseNumber.trim(),
            phone: phone.trim(),
            status
        });
    }, [ experienceYears, fullName, hiredAt, licenseNumber, onSubmit, phone, status ]);

    return (
        <form className = 'form'
            onSubmit = { _onSubmit }>
            {error || localError ? <p className = 'banner banner--error'>{error ?? localError}</p> : null}
            <label className = 'field'>
                <span className = 'field__label'>ФИО *</span>
                <input
                    name = 'fullName'
                    onChange = { _onFieldChange }
                    required = { true }
                    value = { fullName } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Телефон *</span>
                <input
                    name = 'phone'
                    onChange = { _onFieldChange }
                    placeholder = '+7 900 000-00-00'
                    required = { true }
                    value = { phone } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Водительское удостоверение *</span>
                <input
                    name = 'licenseNumber'
                    onChange = { _onFieldChange }
                    required = { true }
                    value = { licenseNumber } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Стаж, лет *</span>
                <input
                    min = { 0 }
                    name = 'experienceYears'
                    onChange = { _onFieldChange }
                    required = { true }
                    type = 'number'
                    value = { experienceYears } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Статус</span>
                <select name = 'status'
                    onChange = { _onFieldChange }
                    value = { status }>
                    {Object.entries(driverStatusLabel).map(([ value, label ]) =>
                        (<option key = { value }
                            value = { value }>{label}</option>)
                    )}
                </select>
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Дата приёма *</span>
                <input
                    name = 'hiredAt'
                    onChange = { _onFieldChange }
                    required = { true }
                    type = 'date'
                    value = { hiredAt } />
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
