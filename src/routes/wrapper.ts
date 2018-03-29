import { NextFunction, Request, RequestHandler, Response } from 'express';

export default function wrap(callable: RequestHandler): RequestHandler {
    return function (request: Request, response: Response, next: NextFunction): void {
        let value = callable(request, response, next);

        if (value instanceof Promise) {
            value.catch(next);
        }

        if (value instanceof Error) {
            next(value);
        }
    };
}
