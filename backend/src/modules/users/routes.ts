import { Router } from 'express';

import { validate } from '../../middleware/validate';

import * as controller from './controller';
import { createUserBodySchema, idParamsSchema, resetPasswordBodySchema } from './validators';

// Router — фабрика без construct-сигнатуры: TS требует вызов без new
// eslint-disable-next-line new-cap
export const usersRouter = Router();

usersRouter.get('/', controller.list);
usersRouter.post('/', validate({ body: createUserBodySchema }), controller.create);
usersRouter.put('/:id',
    validate({ body: resetPasswordBodySchema,
        params: idParamsSchema }),
    controller.resetPassword);
usersRouter.delete('/:id', validate({ params: idParamsSchema }), controller.remove);
