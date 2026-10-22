export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('ru-RU');
}

export function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('ru-RU', {
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export function formatMoney(amount: number): string {
    return `${amount.toLocaleString('ru-RU')} ₽`;
}
