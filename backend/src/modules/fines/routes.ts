import { Router } from 'express';

import { validate } from '../../middleware/validate';

import * as controller from './controller';
import { fineBodySchema, idParamsSchema } from './validators';

// Router — фабрика без construct-сигнатуры: TS требует вызов без new
// eslint-disable-next-line new-cap
export const finesRouter = Router();

finesRouter.get('/', controller.list);
finesRouter.post('/', validate({ body: fineBodySchema }), controller.create);
finesRouter.put('/:id', validate({ body: fineBodySchema,
    params: idParamsSchema }), controller.update);
finesRouter.delete('/:id', validate({ params: idParamsSchema }), controller.remove);
