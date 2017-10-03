import {Response, Request} from 'express';
import BaseController from './BaseController';
import ServiceRepository from '../repositories/loki/ServiceRepository';
import StubRepository from '../repositories/loki/StubRepository';
import SessionRepository from '../repositories/loki/SessionRepository';

export default class FlushController extends BaseController {

    protected serviceRepository: ServiceRepository;
    protected stubRepository: StubRepository;
    protected sessionRepository: SessionRepository;

    constructor(serviceRepository: ServiceRepository, stubRepository: StubRepository, sessionRepository: SessionRepository) {
        super();
        this.serviceRepository = serviceRepository;
        this.stubRepository = stubRepository;
        this.sessionRepository = sessionRepository;
    }
    /**
     * @param {Request} request
     * @param {Response} response
     */
    public flush(request: Request, response: Response): any {
        this.serviceRepository.clear();
        this.stubRepository.clear();
        this.sessionRepository.clear();

        this.respondWithNoContent(response);
    }
}
