import { Router } from 'express';

import * as controller from './controller';

// Router — фабрика без construct-сигнатуры: TS требует вызов без new
// eslint-disable-next-line new-cap
export const healthRouter = Router();

healthRouter.get('/', controller.health);
