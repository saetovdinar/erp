import type { BadgeTone } from '../base/components/Badge';

import type { BookingStatus } from './types';

export const bookingStatusLabel: Record<BookingStatus, string> = {
    active: 'Идёт',
    cancelled: 'Отменено',
    completed: 'Завершено',
    planned: 'Запланировано'
};

export const bookingStatusTone: Record<BookingStatus, BadgeTone> = {
    active: 'success',
    cancelled: 'danger',
    completed: 'neutral',
    planned: 'info'
};
