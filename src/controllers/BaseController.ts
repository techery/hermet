import NotFound from './../errors/NotFound';
import { Response } from 'express';
import ValidationError from '../errors/ValidationError';

abstract class BaseController {
    /**
     * Return json response
     *
     * @param {Response} response
     * @param {*} json
     * @param {number} status
     */
    protected respondJson(response: Response, json: any, status?: number): void {
        response.status(status || 200).json(json);
    }

    /**
     * Return 204 No Content response
     *
     * @param {Response} response
     */
    protected respondWithNoContent(response: Response): void {
        response.status(204).end();
    }

    /**
     * Return 404 not found response (throw NotFound error)
     *
     * @throws NotFound
     */
    protected respondWithNotFound(): void {
        throw new NotFound('The requested resource couldn\'t be found');
    }

    /**
     * Return 400 with validation error message
     *
     * @param {string} message
     */
    protected respondWithValidationError(message: string): void {
        throw new ValidationError(400, message);
    }
}

export default BaseController;
