import { type ChangeEvent, type FormEvent, useCallback, useState } from 'react';

import type { IUserCreateInput } from '../types';

interface IProps {
    error: string | null;
    onCancel: () => void;
    onSubmit: (input: IUserCreateInput) => Promise<void>;
}

/** Создание учётки: логин (неизменяем в дальнейшем) и стартовый пароль. */
export function UserForm({ error, onCancel, onSubmit }: IProps) {
    const [ localError, setLocalError ] = useState<string | null>(null);
    const [ login, setLogin ] = useState('');
    const [ password, setPassword ] = useState('');

    const _onFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'login') {
            setLogin(value);
        } else {
            setPassword(value);
        }
    }, []);

    const _onCancelClick = useCallback(() => {
        onCancel();
    }, [ onCancel ]);

    const _onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError(null);

        if (login.trim().length < 3) {
            setLocalError('Логин — от 3 символов');

            return;
        }
        if (password.length < 8) {
            setLocalError('Пароль — от 8 символов');

            return;
        }
        void onSubmit({ login: login.trim(),
            password });
    }, [ login, onSubmit, password ]);

    return (
        <form className = 'form'
            onSubmit = { _onSubmit }>
            {error || localError ? <p className = 'banner banner--error'>{error ?? localError}</p> : null}
            <label className = 'field'>
                <span className = 'field__label'>Логин *</span>
                <input
                    name = 'login'
                    onChange = { _onFieldChange }
                    required = { true }
                    value = { login } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Пароль *</span>
                <input
                    autoComplete = 'new-password'
                    name = 'password'
                    onChange = { _onFieldChange }
                    required = { true }
                    type = 'password'
                    value = { password } />
            </label>
            <div className = 'form__actions'>
                <button className = 'btn'
                    onClick = { _onCancelClick }
                    type = 'button'>Отмена</button>
                <button className = 'btn btn--primary'
                    type = 'submit'>Создать</button>
            </div>
        </form>
    );
}
