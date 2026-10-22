import { z } from 'zod';

// Формат даты — как в формах фронта: 'YYYY-MM-DD'.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const fineBodySchema = z.object({
    amount: z.number().int()
.positive()
.max(1_000_000),
    article: z.string().trim()
.min(1)
.max(200),
    date: z.string().regex(DATE_RE, 'Формат даты: YYYY-MM-DD'),
    driverId: z.string().uuid()
.nullable(),
    isPaid: z.boolean(),
    vehicleId: z.string().uuid()
});

export const idParamsSchema = z.object({
    id: z.string().uuid()
});
