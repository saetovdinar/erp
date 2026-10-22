import { type MouseEvent, type ReactNode, useCallback } from 'react';

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
        <div className = 'modal__backdrop'
            onClick = { _onBackdropClick }>
            <div className = 'modal'
                onClick = { _onDialogClick }>
                <div className = 'modal__head'>
                    <h2 className = 'modal__title'>{title}</h2>
                    <button
                        aria-label = 'Закрыть'
                        className = 'btn btn--ghost'
                        onClick = { _onCloseClick }
                        type = 'button'>✕</button>
                </div>
                <div className = 'modal__body'>{children}</div>
            </div>
        </div>
    );
}
