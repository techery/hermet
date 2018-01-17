import {Request, Response} from 'express';
import BaseController from './BaseController';
import ServiceRepository from '../repositories/loki/ServiceRepository';
import {SessionRequest} from '../requests/SessionRequest';
import StubRepository from '../repositories/loki/StubRepository';
import {Service} from '../models/Service';
import config from '../config';
import * as moment from 'moment';
import isTtl from '../validators/TtlValidator';

export default class ServicesController extends BaseController {

    protected serviceRepository: ServiceRepository;
    protected stubRepository: StubRepository;

    /**
     * @param {ServiceRepository} serviceRepository
     * @param {StubRepository} stubRepository
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
        const ttl = request.body.hasOwnProperty('ttl') ? request.body.ttl : config.app.default_service_ttl;

        if (!request.body.hasOwnProperty('name') || !/[a-z\d-_]{3,}/.test(request.body.name)) {
            return this.respondWithValidationError('Invalid service name format!');
        }

        if (!request.body.targetUrl) {
            return this.respondWithValidationError('Target url should not be empty!');
        }

        if (request.body.hasOwnProperty('ttl') && !isTtl(request.body.ttl)) {
            return this.respondWithValidationError('Invalid time to life!');
        }

        const name = request.body.name.toLowerCase();
        const servicesCount = this.serviceRepository.count({name: name});
        if (servicesCount > 0) {
            this.respondWithValidationError('Service with name [' + name + '] already exists');
        }

        const service: Service = this.serviceRepository.create({
            name: name,
            targetUrl: request.body.targetUrl,
            ttl: ttl,
            expireAt: ttl ? moment().add(ttl, 's').format() : null
        });

        this.respondJson(response, service, 201);
    }

    /**
     * Get service
     *
     * @param {Request} request
     * @param {Response} response
     */
    public get(request: Request, response: Response): void {
        try {
            const service: Service = this.serviceRepository.get(request.params.serviceId);

            this.respondJson(response, service);
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
        if (request.body.hasOwnProperty('name') && !/[a-z\d-_]{3,}/.test(request.body.name)) {
            return this.respondWithValidationError('Invalid service name format!');
        }

        if (request.body.hasOwnProperty('targetUrl') && !request.body.targetUrl) {
            return this.respondWithValidationError('Target url should not be empty!');
        }

        if (request.body.hasOwnProperty('ttl') && !isTtl(request.body.ttl)) {
            return this.respondWithValidationError('Invalid time to life!');
        }

        const service: Service = this.serviceRepository.get(request.params.serviceId);

        service.name = request.body.name || service.name;
        service.name = service.name.toLowerCase();
        service.targetUrl = request.body.targetUrl || service.targetUrl;

        if (request.body.hasOwnProperty('ttl')) {
            service.ttl = request.body.ttl;
            service.expireAt = moment(service.createAt).add(request.body.ttl).format();
        }

        this.serviceRepository.update(service);

        this.respondJson(response, service);
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
        let items: Service[] = this.serviceRepository.all();

        this.respondJson(response, items);
    }
}
