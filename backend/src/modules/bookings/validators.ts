import { z } from 'zod';

// datetime-local из форм фронта: 'YYYY-MM-DDTHH:mm' (минуты, без секунд/зоны).
const DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const bookingBodySchema = z.object({
    driverId: z.string().uuid(),
    endsAt: z.string().regex(DATETIME_RE, 'Формат времени: YYYY-MM-DDTHH:mm'),
    purpose: z.string().trim()
.min(1)
.max(200),
    startsAt: z.string().regex(DATETIME_RE, 'Формат времени: YYYY-MM-DDTHH:mm'),
    status: z.enum([ 'active', 'cancelled', 'completed', 'planned' ]),
    vehicleId: z.string().uuid()
});

export const idParamsSchema = z.object({
    id: z.string().uuid()
});
