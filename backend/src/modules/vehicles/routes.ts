import { Router } from 'express';

import { validate } from '../../middleware/validate';

import * as controller from './controller';
import { idParamsSchema, vehicleBodySchema } from './validators';

// Router — фабрика без construct-сигнатуры: TS требует вызов без new
// eslint-disable-next-line new-cap
export const vehiclesRouter = Router();

vehiclesRouter.get('/', controller.list);
vehiclesRouter.post('/', validate({ body: vehicleBodySchema }), controller.create);
vehiclesRouter.put('/:id', validate({ body: vehicleBodySchema,
    params: idParamsSchema }), controller.update);
vehiclesRouter.delete('/:id', validate({ params: idParamsSchema }), controller.remove);
