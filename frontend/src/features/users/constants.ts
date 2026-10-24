import type { UserRole } from '../auth/types';
import type { BadgeTone } from '../base/components/Badge';

export const userRoleLabel: Record<UserRole, string> = {
    admin: 'Администратор',
    user: 'Пользователь'
};

export const userRoleTone: Record<UserRole, BadgeTone> = {
    admin: 'info',
    user: 'neutral'
};
