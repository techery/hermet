import { Request, Response } from 'express';
import BaseController from './BaseController';
import Service from '../models/Service';
import config from '../config';
import * as moment from 'moment';
import isTtl from '../validators/TtlValidator';
import Stub from '../models/Stub';

export default class ServicesController extends BaseController {
    /**
     * Create new service
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async create(request: Request, response: Response): Promise<void> {
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
        const servicesCount = await Service.count({ name: name });
        if (servicesCount > 0) {
            this.respondWithValidationError('Service with name [' + name + '] already exists');
        }

        const service = new Service({
            name,
            ttl,
            targetUrl: request.body.targetUrl,
            expireAt: ttl ? moment().add(ttl, 's').toDate() : null
        });

        await service.save();

        this.respondJson(response, service, 201);
    }

    /**
     * Get service
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async get(request: Request, response: Response): Promise<void> {
        const service: Service = await Service.findById(request.params.serviceId);
        if (!service) {
            return this.respondWithNotFound();
        }

        this.respondJson(response, service);
    }

    /**
     * Update service parameters
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async update(request: Request, response: Response): Promise<void> {
        if (request.body.hasOwnProperty('name') && !/[a-z\d-_]{3,}/.test(request.body.name)) {
            return this.respondWithValidationError('Invalid service name format!');
        }

        if (request.body.hasOwnProperty('targetUrl') && !request.body.targetUrl) {
            return this.respondWithValidationError('Target url should not be empty!');
        }

        if (request.body.hasOwnProperty('ttl') && !isTtl(request.body.ttl)) {
            return this.respondWithValidationError('Invalid time to life!');
        }

        const service: Service = await Service.findById(request.params.serviceId);

        if (!service) {
            return this.respondWithNotFound();
        }

        service.name = request.body.name || service.name;
        service.name = service.name.toLowerCase();
        service.targetUrl = request.body.targetUrl || service.targetUrl;

        if (request.body.hasOwnProperty('ttl')) {
            service.ttl = request.body.ttl;
            service.expireAt = moment(service.createAt).add(request.body.ttl).format();
        }

        this.respondJson(response, await service.save());
    }

    /**
     * Delete the service
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async remove(request: Request, response: Response): Promise<void> {
        try {
            await Service.deleteOne({ _id: request.params.serviceId });
            await Stub.deleteMany({ serviceId: request.params.serviceId });
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
        let items: Service[] = await Service.find({});

        this.respondJson(response, items);
    }
}
