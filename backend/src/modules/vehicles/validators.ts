import { z } from 'zod';

export const vehicleBodySchema = z.object({
    make: z.string().trim()
.min(1)
.max(60),
    mileage: z.number().int()
.min(0),
    model: z.string().trim()
.min(1)
.max(60),
    plate: z.string().trim()
.min(1)
.max(20),
    status: z.enum([ 'active', 'maintenance', 'retired' ]),
    vehicleType: z.enum([ 'minivan', 'sedan', 'suv', 'wagon' ]),
    year: z.number().int()
.min(1950)
.max(2100)
});

export const idParamsSchema = z.object({
    id: z.string().uuid()
});
