import { Modal } from './Modal';

interface IProps {
    error: string | null;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    title: string;
}

export function ConfirmDialog({ error, message, onCancel, onConfirm, title }: IProps) {
    return (
        <Modal onClose = { onCancel }
            title = { title }>
            <p className = 'confirm__message'>{message}</p>
            {error ? <p className = 'banner banner--error'>{error}</p> : null}
            <div className = 'form__actions'>
                <button className = 'btn'
                    onClick = { onCancel }
                    type = 'button'>Отмена</button>
                <button className = 'btn btn--danger'
                    onClick = { onConfirm }
                    type = 'button'>Удалить</button>
            </div>
        </Modal>
    );
}
