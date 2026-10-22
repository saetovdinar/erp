import { Router } from 'express';

import { validate } from '../../middleware/validate';

import * as controller from './controller';
import { driverBodySchema, idParamsSchema } from './validators';

// Router — фабрика без construct-сигнатуры: TS требует вызов без new
// eslint-disable-next-line new-cap
export const driversRouter = Router();

driversRouter.get('/', controller.list);
driversRouter.post('/', validate({ body: driverBodySchema }), controller.create);
driversRouter.put('/:id', validate({ body: driverBodySchema,
    params: idParamsSchema }), controller.update);
driversRouter.delete('/:id', validate({ params: idParamsSchema }), controller.remove);
