import {Response, Request} from 'express';
import BaseController from './BaseController';
import ServiceRepository from '../repositories/loki/ServiceRepository';
import StubRepository from '../repositories/loki/StubRepository';

export default class FlushController extends BaseController {

    protected serviceRepository: ServiceRepository;
    protected stubRepository: StubRepository;

    constructor(serviceRepository: ServiceRepository, stubRepository: StubRepository) {
        super();
        this.serviceRepository = serviceRepository;
        this.stubRepository = stubRepository;
    }
    /**
     * @param {Request} request
     * @param {Response} response
     */
    public flush(request: Request, response: Response): any {
        this.serviceRepository.clear();
        this.stubRepository.clear();

        this.respondWithNoContent(response);
    }
}
