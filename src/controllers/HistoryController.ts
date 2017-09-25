import BaseController from './BaseController';
import {Response, Request} from 'express';
import RequestsRepository from '../repositories/elastic/RequestsRepository';
import {SessionRequest} from '../requests/SessionRequest';

export default class HistoryController extends BaseController {

    private requestsRepository: RequestsRepository;

    /**
     * @param {RequestsRepository} requestsRepository
     */
    constructor(requestsRepository: RequestsRepository) {
        super();
        this.requestsRepository = requestsRepository;
    }

    /**
     * Get all history
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async list(request: SessionRequest, response: Response): Promise<void> {
        let items = await this.requestsRepository.all({
            serviceId: request.params.serviceId,
            sessionId: request.session.id
        });

        this.respondJson(response, items);
    }

    /**
     * Remove all history
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async removeAll(request: SessionRequest, response: Response): Promise<void> {
        let searchParams: any = {
            sessionId: request.session.id,
            serviceId: request.params.serviceId
        };

        await this.requestsRepository.removeAll(searchParams);

        this.respondWithNoContent(response);
    }
}
