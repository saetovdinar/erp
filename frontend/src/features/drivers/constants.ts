import type { BadgeTone } from '../base/components/Badge';

import type { DriverStatus } from './types';

export const driverStatusLabel: Record<DriverStatus, string> = {
    active: 'Работает',
    fired: 'Уволен',
    vacation: 'Отпуск'
};

export const driverStatusTone: Record<DriverStatus, BadgeTone> = {
    active: 'success',
    fired: 'neutral',
    vacation: 'warn'
};
