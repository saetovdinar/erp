import type { BadgeTone } from '../base/components/Badge';

import type { VehicleStatus, VehicleType } from './types';

export const vehicleStatusLabel: Record<VehicleStatus, string> = {
    active: 'В работе',
    maintenance: 'Обслуживание',
    retired: 'Списан'
};

export const vehicleStatusTone: Record<VehicleStatus, BadgeTone> = {
    active: 'success',
    maintenance: 'warn',
    retired: 'neutral'
};

export const vehicleTypeLabel: Record<VehicleType, string> = {
    minivan: 'Минивэн',
    sedan: 'Седан',
    suv: 'Внедорожник',
    wagon: 'Универсал'
};
