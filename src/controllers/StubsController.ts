import {Request, Response} from 'express';
import BaseController from './BaseController';
import StubsRepository from '../repositories/StubsRepository';
import {SessionRequest} from '../requests/SessionRequest';
import {Stub} from '../models/Stub';

export default class StubsController extends BaseController {
    protected stubsRepository: StubsRepository;

    /**
     * @param {Object} stubsRepository
     */
    constructor(stubsRepository: StubsRepository) {
        super();
        this.stubsRepository = stubsRepository;
    }

    /**
     * Create new stub
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async create(request: SessionRequest, response: Response): Promise<void> {

        let stub: Stub = new Stub(request.body);
        stub.sessionId = request.session.id;
        stub.expireAt = request.session.expireAt;
        stub.serviceId = request.params.serviceId;

        let result = await this.stubsRepository.create(stub);

        this.respondWithCreated(response, 'api/services/' + request.params.serviceId + '/stubs/' + result._id);
    }

    /**
     * Get stub
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async get(request: SessionRequest, response: Response): Promise<void> {
        try {
            let stub = await this.stubsRepository.get(request.params.stubId);

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
    public async update(request: Request, response: Response): Promise<void> {
        await this.stubsRepository.update(request.params.stubId, request.body);
        this.respondWithNoContent(response);
    }

    /**
     * Remove stub
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async remove(request: Request, response: Response): Promise<void> {
        try {
            await this.stubsRepository.remove(request.params.stubId);
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
    public async list(request: SessionRequest, response: Response): Promise<void> {
        let items = await this.stubsRepository.all({
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
    public async removeAll(request: SessionRequest, response: Response): Promise<void> {
        let searchParams: any = {
            sessionId: request.session.id
        };

        if (request.params.suitId) {
            searchParams.serviceId = request.params.serviceId;
        }

        if (request.params.suitId) {
            searchParams.suitId = request.params.suitId;
        }

        await this.stubsRepository.removeAll();

        this.respondWithNoContent(response);
    }
}
