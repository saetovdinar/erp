import { z } from 'zod';

// Формат дат — как в формах фронта: 'YYYY-MM-DD' и 'YYYY-MM-DDTHH:mm'.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const driverBodySchema = z.object({
    experienceYears: z.number().int()
.min(0)
.max(70),
    fullName: z.string().trim()
.min(1)
.max(200),
    hiredAt: z.string().regex(DATE_RE, 'Формат даты: YYYY-MM-DD'),
    licenseNumber: z.string().trim()
.min(1)
.max(50),
    phone: z.string().trim()
.min(1)
.max(30),
    status: z.enum([ 'active', 'fired', 'vacation' ])
});

export const idParamsSchema = z.object({
    id: z.string().uuid()
});
