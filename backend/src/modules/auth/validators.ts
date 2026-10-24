import { z } from 'zod';

// формат тела логина: роль/политику пароля не раскрываем — только непустые строки
export const loginBodySchema = z.object({
    login: z.string().trim()
.min(1)
.max(50),
    password: z.string().min(1)
.max(200)
});

// смена собственного пароля: текущий подтверждаем, новый — от 8 символов
export const changePasswordBodySchema = z.object({
    currentPassword: z.string().min(1)
.max(200),
    newPassword: z.string().min(8)
.max(200)
});
