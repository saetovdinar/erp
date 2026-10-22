import type { BadgeTone } from './components/Badge';
import type {
    BookingStatus,
    DriverStatus,
    VehicleStatus,
    VehicleType
} from './types/entities';

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

// Record<boolean, …> в TS невозможен — для булева статуса функции вместо карт
export function fineStatusLabel(isPaid: boolean): string {
    return isPaid ? 'Оплачен' : 'Не оплачен';
}

export function fineStatusTone(isPaid: boolean): BadgeTone {
    return isPaid ? 'success' : 'danger';
}

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
