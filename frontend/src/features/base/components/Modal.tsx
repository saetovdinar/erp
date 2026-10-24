import { type MouseEvent, type ReactNode, useCallback } from 'react';

import styles from './modal.module.css';

interface IProps {
    children: ReactNode;
    onClose: () => void;
    title: string;
}

export function Modal({ children, onClose, title }: IProps) {
    const _onBackdropClick = useCallback(() => {
        onClose();
    }, [ onClose ]);

    const _onCloseClick = useCallback(() => {
        onClose();
    }, [ onClose ]);

    const _onDialogClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }, []);

    return (
        <div className = { styles.backdrop }
            onClick = { _onBackdropClick }>
            <div className = { styles.modal }
                onClick = { _onDialogClick }>
                <div className = { styles.head }>
                    <h2 className = { styles.title }>{title}</h2>
                    <button
                        aria-label = 'Закрыть'
                        className = 'btn btn--ghost'
                        onClick = { _onCloseClick }
                        type = 'button'>✕</button>
                </div>
                <div className = { styles.body }>{children}</div>
            </div>
        </div>
    );
}
