import config from '../config';
import NotFound from './errors/NotFound';
import {Response} from 'express';

export default class BaseController {
    /**
     * Return json response
     *
     * @param {Response} response
     * @param {*} json
     */
    protected respondJson(response: Response, json: any): void {
        response.status(200).json(json);
    }

    /**
     * Return 201 Created response
     *
     * @param {Response} response
     * @param {string} uri
     */
    protected respondWithCreated(response: Response, uri: string): void {
        response.set('Location', config.app.hermet_api_base_url + uri)
            .status(201)
            .end();
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
}