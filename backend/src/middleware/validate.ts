import type { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

import { ApiError } from '../errors/ApiError';
import { ErrorCode } from '../errors/ErrorCode';

interface ISchemas {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

/** zod-валидация части запроса; провал → 400 VALIDATION_ERROR со списком полей. */
export function validate(schemas: ISchemas) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const details: Array<{ field: string;
            message: string; }> = [];

        for (const part of [ 'params', 'query', 'body' ] as const) {
            const schema = schemas[part];

            if (!schema) {
                continue;
            }
            const result = schema.safeParse(req[part]);

            if (result.success) {
                // в Express 5 у req.query только геттер — прямое присваивание бросает TypeError
                Object.defineProperty(req, part, { value: result.data,
                    writable: true,
                    configurable: true });
            } else {
                for (const issue of result.error.issues) {
                    details.push({
                        field: `${part}.${issue.path.join('.')}`,
                        message: issue.message
                    });
                }
            }
        }
        if (details.length > 0) {
            next(new ApiError(400, ErrorCode.Validation, 'Ошибка валидации', details));

            return;
        }
        next();
    };
}
