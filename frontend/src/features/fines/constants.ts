import type { BadgeTone } from '../base/components/Badge';

// Record<boolean, …> в TS невозможен — для булева статуса функции вместо карт
export function fineStatusLabel(isPaid: boolean): string {
    return isPaid ? 'Оплачен' : 'Не оплачен';
}

export function fineStatusTone(isPaid: boolean): BadgeTone {
    return isPaid ? 'success' : 'danger';
}
