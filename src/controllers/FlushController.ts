import { Request, Response } from 'express';
import BaseController from './BaseController';
import Service from '../models/Service';
import Stub from '../models/Stub';

export default class FlushController extends BaseController {
    /**
     * @param {Request} request
     * @param {Response} response
     */
    public async flush(request: Request, response: Response): Promise<void> {
        await Service.deleteMany({});
        await Stub.deleteMany({});

        this.respondWithNoContent(response);
    }
}
