import { type ChangeEvent, type FormEvent, useCallback, useState } from 'react';

import type { IUserAccount } from '../types';

interface IProps {
    error: string | null;
    onCancel: () => void;
    onSubmit: (password: string) => Promise<void>;
    user: IUserAccount;
}

/** Сброс пароля учётки админом (логин не меняется). */
export function ResetPasswordForm({ error, onCancel, onSubmit, user }: IProps) {
    const [ localError, setLocalError ] = useState<string | null>(null);
    const [ password, setPassword ] = useState('');
    const [ repeat, setRepeat ] = useState('');

    const _onFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'password') {
            setPassword(value);
        } else {
            setRepeat(value);
        }
    }, []);

    const _onCancelClick = useCallback(() => {
        onCancel();
    }, [ onCancel ]);

    const _onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError(null);

        if (password.length < 8) {
            setLocalError('Пароль — от 8 символов');

            return;
        }
        if (password !== repeat) {
            setLocalError('Пароли не совпадают');

            return;
        }
        void onSubmit(password);
    }, [ onSubmit, password, repeat ]);

    return (
        <form className = 'form'
            onSubmit = { _onSubmit }>
            {error || localError ? <p className = 'banner banner--error'>{error ?? localError}</p> : null}
            <label className = 'field'>
                <span className = 'field__label'>Новый пароль для «{user.login}» *</span>
                <input
                    autoComplete = 'new-password'
                    name = 'password'
                    onChange = { _onFieldChange }
                    required = { true }
                    type = 'password'
                    value = { password } />
            </label>
            <label className = 'field'>
                <span className = 'field__label'>Повторите пароль *</span>
                <input
                    autoComplete = 'new-password'
                    name = 'repeat'
                    onChange = { _onFieldChange }
                    required = { true }
                    type = 'password'
                    value = { repeat } />
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
