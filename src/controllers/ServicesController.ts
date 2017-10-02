import {Response, Request} from 'express';
import BaseController from './BaseController';
import ServiceRepository from '../repositories/standalone/ServiceRepository';
import {SessionRequest} from '../requests/SessionRequest';
import StubsRepository from '../repositories/standalone/StubsRepository';
import {Service} from '../models/Service';
import config from '../config';

export default class ServicesController extends BaseController {

    protected serviceRepository: ServiceRepository;
    protected stubsRepository: StubsRepository;

    /**
     * @param {ServiceRepository} serviceRepository
     * @param {StubsRepository} stubsRepository
     */
    constructor(serviceRepository: ServiceRepository, stubsRepository: StubsRepository) {
        super();
        this.serviceRepository = serviceRepository;
        this.stubsRepository = stubsRepository;
    }

    /**
     * Create new service
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async create(request: Request, response: Response): Promise<void> {
        const proxyHost: string = request.body.proxyHost;

        let services: Service[] = this.serviceRepository.getServicesByProxyHost(proxyHost);
        if (services.length > 0) {
            this.respondWithValidationError('Service with proxy host [' + proxyHost + '] already exists');
        }

        request.body.ttl = request.body.hasOwnProperty('ttl') ? request.body.ttl : config.app.default_service_ttl;
        let service: Service = new Service(request.body);
        let result = await this.serviceRepository.create(service);
        this.respondWithCreated(response, 'api/services/' + result.id);
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
    public async remove(request: SessionRequest, response: Response): Promise<void> {
        try {
            await this.serviceRepository.remove(request.params.serviceId);
            await this.stubsRepository.removeAll({
                sessionId: request.session.id,
                serviceId: request.params.serviceId
            });
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
