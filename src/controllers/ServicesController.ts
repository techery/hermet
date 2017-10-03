import {Request, Response} from 'express';
import BaseController from './BaseController';
import ServiceRepository from '../repositories/loki/ServiceRepository';
import {SessionRequest} from '../requests/SessionRequest';
import StubRepository from '../repositories/loki/StubRepository';
import {Service} from '../models/Service';
import config from '../config';

export default class ServicesController extends BaseController {

    protected serviceRepository: ServiceRepository;
    protected stubRepository: StubRepository;

    /**
     * @param {ServiceRepository} serviceRepository
     * @param {StubsRepository} stubRepository
     */
    constructor(serviceRepository: ServiceRepository, stubRepository: StubRepository) {
        super();
        this.serviceRepository = serviceRepository;
        this.stubRepository = stubRepository;
    }

    /**
     * Create new service
     *
     * @param {Request} request
     * @param {Response} response
     */
    public create(request: Request, response: Response): void {
        const proxyHost: string = request.body.proxyHost;

        let servicesCount = this.serviceRepository.count({proxyHost: proxyHost});
        if (servicesCount > 0) {
            this.respondWithValidationError('Service with proxy host [' + proxyHost + '] already exists');
        }

        request.body.ttl = request.body.hasOwnProperty('ttl') ? request.body.ttl : config.app.default_service_ttl;
        let service: Service = new Service(request.body);
        let result = this.serviceRepository.create(service);
        this.respondWithCreated(response, 'api/services/' + result.id);
    }

    /**
     * Get service
     *
     * @param {Request} request
     * @param {Response} response
     */
    public get(request: Request, response: Response): void {
        try {
            let item = this.serviceRepository.get(request.params.serviceId);

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
    public update(request: Request, response: Response): void {
        this.serviceRepository.findAndUpdate(request.params.serviceId, request.body);
        this.respondWithNoContent(response);
    }

    /**
     * Delete the service
     *
     * @param {Request} request
     * @param {Response} response
     */
    public remove(request: SessionRequest, response: Response): void {
        try {
            this.serviceRepository.delete({id: request.params.serviceId});
            this.stubRepository.delete({
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
    public list(request: Request, response: Response): void {
        let items = this.serviceRepository.all();

        this.respondJson(response, items);
    }
}
