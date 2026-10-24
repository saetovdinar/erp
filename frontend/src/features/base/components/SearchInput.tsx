import type { ChangeEvent } from 'react';

import styles from './search-input.module.css';

interface IProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    value: string;
}

export function SearchInput({ onChange, placeholder, value }: IProps) {
    return (
        <input
            className = { `input ${styles.search}` }
            onChange = { onChange }
            placeholder = { placeholder }
            type = 'search'
            value = { value } />
    );
}
