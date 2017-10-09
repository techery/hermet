import {Request, Response} from 'express';
import BaseController from './BaseController';
import {SessionRequest} from '../requests/SessionRequest';
import {Stub} from '../models/Stub';
import config from '../config';
import StubRepository from '../repositories/loki/StubRepository';
import StubValidator from '../validators/StubValidator';

export default class StubsController extends BaseController {
    protected stubRepository: StubRepository;
    protected stubValidator: StubValidator;

    /**
     * @param {Object} stubRepository
     * @param {StubValidator} stubValidator
     */
    constructor(stubRepository: StubRepository, stubValidator: StubValidator) {
        super();
        this.stubRepository = stubRepository;
        this.stubValidator = stubValidator;
    }

    /**
     * Create new stub
     *
     * @param {Request} request
     * @param {Response} response
     */
    public create(request: SessionRequest, response: Response): void {
        let items: Stub[] = this.stubRepository.find({
            serviceId: request.params.serviceId,
            sessionId: request.session.id
        });
        this.stubValidator.validate(request.body, items);

        request.body.ttl = request.body.hasOwnProperty('ttl') ? request.body.ttl : config.app.default_stub_ttl;
        let stub: Stub = new Stub(request.body);
        stub.sessionId = request.session.id;
        stub.serviceId = request.params.serviceId;

        let result = this.stubRepository.create(stub);

        this.respondWithCreated(response, 'api/services/' + request.params.serviceId + '/stubs/' + result.id);
    }

    /**
     * Get stub
     *
     * @param {Request} request
     * @param {Response} response
     */
    public get(request: SessionRequest, response: Response): void {
        try {
            let stub = this.stubRepository.get(request.params.stubId);

            this.respondJson(response, stub);
        } catch (err) {
            this.respondWithNotFound();
        }
    }

    /**
     * Update stub details
     *
     * @param {Request} request
     * @param {Response} response
     */
    public update(request: Request, response: Response): void {
        this.stubRepository.findAndUpdate(request.params.stubId, request.body);
        this.respondWithNoContent(response);
    }

    /**
     * Remove stub
     *
     * @param {Request} request
     * @param {Response} response
     */
    public remove(request: Request, response: Response): void {
        try {
            this.stubRepository.delete({id: request.params.stubId});
            this.respondWithNoContent(response);
        } catch (err) {
            this.respondWithNotFound();
        }
    }

    /**
     * Get all stubs
     *
     * @param {Request} request
     * @param {Response} response
     */
    public list(request: SessionRequest, response: Response): void {
        let items: Stub[] = this.stubRepository.find({
            serviceId: request.params.serviceId,
            sessionId: request.session.id
        });

        this.respondJson(response, items);
    }

    /**
     * Remove all stubs
     *
     * @param {Request} request
     * @param {Response} response
     */
    public removeAll(request: SessionRequest, response: Response): void {
        let searchParams: any = {
            sessionId: request.session.id
        };

        if (request.params.serviceId) {
            searchParams.serviceId = request.params.serviceId;
        }

        this.stubRepository.findAndRemove(searchParams);

        this.respondWithNoContent(response);
    }
}
