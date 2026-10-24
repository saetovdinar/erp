import { type ChangeEvent, type FormEvent, useCallback, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { login } from '../actions';
import { selectAuthStatus } from '../selectors';

import styles from './login-page.module.css';

interface IFormState {
    login: string;
    password: string;
}

/** Экран входа: логин + пароль → JWT в localStorage → редирект в панель. */
export function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const status = useAppSelector(selectAuthStatus);
    const [ form, setForm ] = useState<IFormState>({ login: '',
        password: '' });
    const [ error, setError ] = useState<string | null>(null);
    const [ pending, setPending ] = useState(false);

    const _onFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm(prev => {
            return { ...prev,
                [name]: value };
        });
    }, []);

    const _onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!form.login.trim() || !form.password) {
            setError('Введите логин и пароль');

            return;
        }

        setPending(true);
        dispatch(login({ login: form.login.trim(),
            password: form.password }))
            .then(() => navigate('/drivers'))
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : 'Ошибка входа');
            })
            .finally(() => setPending(false));
    }, [ dispatch, form.login, form.password, navigate ]);

    // уже вошли — на панель
    if (status === 'in') {
        return (
            <Navigate
                replace = { true }
                to = '/drivers' />
        );
    }

    return (
        <div className = { styles.root }>
            <form className = { styles.card }
                onSubmit = { _onSubmit }>
                <h1 className = { styles.title }>ERP · Такси</h1>
                <p className = { styles.hint }>Войдите, чтобы продолжить</p>
                {error ? <p className = 'banner banner--error'>{error}</p> : null}
                <label className = 'field'>
                    <span className = 'field__label'>Логин</span>
                    <input
                        autoComplete = 'username'
                        name = 'login'
                        onChange = { _onFieldChange }
                        required = { true }
                        value = { form.login } />
                </label>
                <label className = 'field'>
                    <span className = 'field__label'>Пароль</span>
                    <input
                        autoComplete = 'current-password'
                        name = 'password'
                        onChange = { _onFieldChange }
                        required = { true }
                        type = 'password'
                        value = { form.password } />
                </label>
                <button className = { `btn btn--primary ${styles.submit}` }
                    disabled = { pending }
                    type = 'submit'>{pending ? 'Вхожу…' : 'Войти'}</button>
            </form>
        </div>
    );
}
