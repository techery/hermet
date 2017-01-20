import {Response, Request} from 'express';
import BaseController from './BaseController';

export default class FlushController extends BaseController {

    protected storage: any;

    constructor(storage: any) {
        super();
        this.storage = storage;
    }
    /**
     * @param {Request} request
     * @param {Response} response
     */
    public flush(request: Request, response: Response): any {
        this.storage.session = {};
        this.storage.service = {};
        this.storage.stub = {};
        this.storage.log = {};

        this.respondWithNoContent(response);
    }
}
