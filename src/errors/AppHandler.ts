import Handler from './Handler';
import { Request, Response } from 'express';
import NotFound from './NotFound';
import ValidationError from './ValidationError';

export default class AppHandler extends Handler {
    /**
     * Handle App error
     *
     * @param {any} error
     * @param {Request} request
     * @param {Response} response
     */
    public handle(error: any, request: Request, response: Response): void {
        this.log(request, error);

        if (error instanceof NotFound) {
            this.error(response, 404, error.name + ': ' + error.message);
        } else if (error instanceof ValidationError) {
            this.error(response, error.httpCode, error.message);
        } else if (error instanceof Error) {
            this.error(response, 500, error.name + ': ' + error.message);
        } else {
            this.error(response, 500, 'Error: Something went wrong');
        }
    }
}
