import type { ChangeEvent } from 'react';

interface IProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    value: string;
}

export function SearchInput({ onChange, placeholder, value }: IProps) {
    return (
        <input
            className = 'input input--search'
            onChange = { onChange }
            placeholder = { placeholder }
            type = 'search'
            value = { value } />
    );
}
