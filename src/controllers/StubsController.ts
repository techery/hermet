import { Request, Response } from 'express';
import BaseController from './BaseController';
import Stub from '../models/Stub';
import config from '../config';
import StubValidator from '../validators/StubValidator';
import * as moment from 'moment';
import isTtl from '../validators/TtlValidator';
import * as _ from 'lodash';

export default class StubsController extends BaseController {
    protected stubValidator: StubValidator;

    /**
     * @param {StubValidator} stubValidator
     */
    constructor(stubValidator: StubValidator) {
        super();
        this.stubValidator = stubValidator;
    }

    /**
     * Create new stub
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async create(request: Request, response: Response): Promise<void> {
        const ttl = request.body.hasOwnProperty('ttl') ? request.body.ttl : config.app.default_stub_ttl;

        if (!request.body.hasOwnProperty('response') || !(_.isObject(request.body.response) || _.isString(request.body.response))) {
            return this.respondWithValidationError('Invalid response!');
        }

        if (!request.body.hasOwnProperty('predicates') || !_.isArray(request.body.predicates)) {
            return this.respondWithValidationError('Invalid predicates!');
        }

        if (request.body.hasOwnProperty('ttl') && !isTtl(request.body.ttl)) {
            return this.respondWithValidationError('Invalid time to life!');
        }

        const items: Stub[] = await Stub.find({ serviceId: request.params.serviceId });

        this.stubValidator.validate(request.body, items);

        const stub: Stub = new Stub({
            response: request.body.response,
            predicates: request.body.predicates,
            serviceId: request.params.serviceId,
            ttl: ttl,
            expireAt: ttl ? moment().add(ttl, 's').toDate() : null
        });

        this.respondJson(response, await stub.save(), 201);
    }

    /**
     * Get stub
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async get(request: Request, response: Response): Promise<void> {
        const stub: Stub = await Stub.findById(request.params.stubId);
        if (!stub) {
            return this.respondWithNotFound();
        }

        this.respondJson(response, stub);
    }

    /**
     * Update stub details
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async update(request: Request, response: Response): Promise<void> {
        if (!request.body.hasOwnProperty('response') || !(_.isObject(request.body.response) || _.isString(request.body.response))) {
            return this.respondWithValidationError('Invalid response!');
        }

        if (request.body.hasOwnProperty('predicates') && !_.isArray(request.body.predicates)) {
            return this.respondWithValidationError('Invalid predicates!');
        }

        if (request.body.hasOwnProperty('ttl') && !isTtl(request.body.ttl)) {
            return this.respondWithValidationError('Invalid time to life!');
        }

        const stub: Stub = await Stub.findById(request.params.stubId);
        if (!stub) {
            return this.respondWithNotFound();
        }

        stub.response = request.body.response || stub.response;
        stub.response = request.body.predicates || stub.predicates;

        if (request.body.hasOwnProperty('ttl')) {
            stub.ttl = request.body.ttl;
            stub.expireAt = moment(stub.createAt).add(request.body.ttl).format();
        }

        this.respondJson(response, await stub.save());
    }

    /**
     * Remove stub
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async remove(request: Request, response: Response): Promise<void> {
        try {
            await Stub.deleteOne({ _id: request.params.stubId });
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
        let items: Stub[] = await Stub.find({ serviceId: request.params.serviceId });

        this.respondJson(response, items);
    }

    /**
     * Remove all stubs
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async removeAll(request: Request, response: Response): Promise<void> {
        let searchParams: any = {};

        if (request.params.serviceId) {
            searchParams.serviceId = request.params.serviceId;
        }

        await Stub.deleteMany(searchParams);

        this.respondWithNoContent(response);
    }
}
