import { z } from 'zod';

// учётку создаёт админ: логин 3–50, пароль от 8 символов
export const createUserBodySchema = z.object({
    login: z.string().trim()
.min(3)
.max(50),
    password: z.string().min(8)
.max(200)
});

export const resetPasswordBodySchema = z.object({
    password: z.string().min(8)
.max(200)
});

export const idParamsSchema = z.object({
    id: z.string().uuid()
});
