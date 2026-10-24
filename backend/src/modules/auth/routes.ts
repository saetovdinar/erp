import { Router } from 'express';

import { authMiddleware } from '../../middleware/auth';
import { validate } from '../../middleware/validate';

import * as controller from './controller';
import { changePasswordBodySchema, loginBodySchema } from './validators';

// Router — фабрика без construct-сигнатуры: TS требует вызов без new
// eslint-disable-next-line new-cap
export const authRouter = Router();

authRouter.post('/login', validate({ body: loginBodySchema }), controller.login);
authRouter.get('/me', authMiddleware, controller.me);
authRouter.put('/password', authMiddleware,
    validate({ body: changePasswordBodySchema }),
    controller.changePassword);
