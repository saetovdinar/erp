import { type ChangeEvent, type FormEvent, useCallback, useState } from 'react';

import { useAppDispatch } from '../../../app/hooks';
import { changePassword } from '../actions';

import styles from './PasswordPage.module.css';

interface IFormState {
    currentPassword: string;
    newPassword: string;
    repeat: string;
}

/** Смена собственного пароля: текущий подтверждается, новый — от 8 символов. */
export function PasswordPage() {
    const dispatch = useAppDispatch();
    const [ form, setForm ] = useState<IFormState>({ currentPassword: '',
        newPassword: '',
        repeat: '' });
    const [ error, setError ] = useState<string | null>(null);
    const [ pending, setPending ] = useState(false);
    const [ saved, setSaved ] = useState(false);

    const _onFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setSaved(false);
        setForm(prev => {
            return { ...prev,
                [name]: value };
        });
    }, []);

    const _onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!form.currentPassword || form.newPassword.length < 8) {
            setError('Текущий пароль обязателен, новый — от 8 символов');

            return;
        }
        if (form.newPassword !== form.repeat) {
            setError('Новый пароль и повтор не совпадают');

            return;
        }

        setPending(true);
        dispatch(changePassword({ currentPassword: form.currentPassword,
            newPassword: form.newPassword }))
            .then(() => {
                setSaved(true);
                setForm({ currentPassword: '',
                    newPassword: '',
                    repeat: '' });
            })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : 'Не удалось изменить пароль');
            })
            .finally(() => setPending(false));
    }, [ dispatch, form.currentPassword, form.newPassword, form.repeat ]);

    return (
        <section>
            <div className = 'page-head'>
                <h1 className = 'page-title'>Смена пароля</h1>
            </div>
            <form className = { `form ${styles.form}` }
                onSubmit = { _onSubmit }>
                {error ? <p className = 'banner banner--error'>{error}</p> : null}
                {saved ? <p className = { styles.saved }>Пароль изменён</p> : null}
                <label className = 'field'>
                    <span className = 'field__label'>Текущий пароль *</span>
                    <input
                        autoComplete = 'current-password'
                        name = 'currentPassword'
                        onChange = { _onFieldChange }
                        required = { true }
                        type = 'password'
                        value = { form.currentPassword } />
                </label>
                <label className = 'field'>
                    <span className = 'field__label'>Новый пароль *</span>
                    <input
                        autoComplete = 'new-password'
                        name = 'newPassword'
                        onChange = { _onFieldChange }
                        required = { true }
                        type = 'password'
                        value = { form.newPassword } />
                </label>
                <label className = 'field'>
                    <span className = 'field__label'>Повторите новый пароль *</span>
                    <input
                        autoComplete = 'new-password'
                        name = 'repeat'
                        onChange = { _onFieldChange }
                        required = { true }
                        type = 'password'
                        value = { form.repeat } />
                </label>
                <div className = 'form__actions'>
                    <button className = 'btn btn--primary'
                        disabled = { pending }
                        type = 'submit'>{pending ? 'Сохраняю…' : 'Сменить пароль'}</button>
                </div>
            </form>
        </section>
    );
}
