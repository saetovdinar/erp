import { z } from 'zod';

// формат тела логина: роль/политику пароля не раскрываем — только непустые строки
export const loginBodySchema = z.object({
    login: z.string().trim()
.min(1)
.max(50),
    password: z.string().min(1)
.max(200)
});
