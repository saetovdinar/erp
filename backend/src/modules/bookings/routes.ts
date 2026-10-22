import { Router } from 'express';

import { validate } from '../../middleware/validate';

import * as controller from './controller';
import { bookingBodySchema, idParamsSchema } from './validators';

// Router — фабрика без construct-сигнатуры: TS требует вызов без new
// eslint-disable-next-line new-cap
export const bookingsRouter = Router();

bookingsRouter.get('/', controller.list);
bookingsRouter.post('/', validate({ body: bookingBodySchema }), controller.create);
bookingsRouter.put('/:id', validate({ body: bookingBodySchema,
    params: idParamsSchema }), controller.update);
bookingsRouter.delete('/:id', validate({ params: idParamsSchema }), controller.remove);
