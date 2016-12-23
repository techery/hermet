import {Request, Response} from 'express';
import BaseController from './BaseController';
import StubsRepository from '../repositories/StubsRepository';
import {SessionRequest} from '../interfaces/requests/SessionRequest';

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
        request.body.sessionId = request.session.id;
        let result = await this.prepareStubRepositiory(request).create(request.body);

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
            let stub = await this.prepareStubRepositiory(request).get(request.params.stubId);

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
        await this.prepareStubRepositiory(request).update(request.params.stubId, request.body);
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
            await this.prepareStubRepositiory(request).remove(request.params.stubId);
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
    public async list(request: Request, response: Response): Promise<void> {
        let items = await this.prepareStubRepositiory(request).all();

        this.respondJson(response, items);
    }

    /**
     * Remove all stubs
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async removeAll(request: Request, response: Response): Promise<void> {
        await this.prepareStubRepositiory(request).removeAll();

        this.respondWithNoContent(response);
    }

    /**
     * @param {Request} request
     * @returns {Object}
     */
    protected prepareStubRepositiory(request: SessionRequest): StubsRepository {
        return this.stubsRepository
            .setParentId(request.params.serviceId)
            .setTtl(null)
            .setSessionId(request.session.id);
    }
}
