import {Response, Request} from 'express';
import BaseController from './BaseController';
import ServiceRepository from '../repositories/ServiceRepository';

export default class ServicesController extends BaseController {
    protected serviceRepository: ServiceRepository;

    /**
     * @param {serviceRepository} serviceRepository
     */
    constructor(serviceRepository: ServiceRepository) {
        super();
        this.serviceRepository = serviceRepository;
    }

    /**
     * Create new service
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async create(request: Request, response: Response): Promise<void> {
        let result = await this.serviceRepository.create(request.body);

        this.respondWithCreated(response, 'api/services/' + result._id);
    }

    /**
     * Get service
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async get(request: Request, response: Response): Promise<void> {
        try {
            let item = await this.serviceRepository.get(request.params.serviceId);

            this.respondJson(response, item);
        } catch (err) {
            this.respondWithNotFound();
        }
    }

    /**
     * Update service parameters
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async update(request: Request, response: Response): Promise<void> {
        await this.serviceRepository.update(request.params.serviceId, request.body);
        this.respondWithNoContent(response);
    }

    /**
     * Delete the service
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async remove(request: Request, response: Response): Promise<void> {
        try {
            await this.serviceRepository.remove(request.params.serviceId);
            this.respondWithNoContent(response);
        } catch (err) {
            this.respondWithNotFound();
        }
    }

    /**
     * Get services list
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async list(request: Request, response: Response): Promise<void> {
        let items = await this.serviceRepository.all();

        this.respondJson(response, items);
    }
}
