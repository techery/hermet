import {Request, Response} from 'express';
import BaseController from './BaseController';
import {SessionRequest} from '../requests/SessionRequest';
import {Stub} from '../models/Stub';
import config from '../config';
import StubRepository from '../repositories/loki/StubRepository';
import StubValidator from '../validators/StubValidator';
import * as moment from 'moment';
import isTtl from '../validators/TtlValidator';
import * as _ from 'lodash';

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
        const ttl = request.body.hasOwnProperty('ttl') ? request.body.ttl : config.app.default_stub_ttl;

        if (!request.body.hasOwnProperty('response') || (!_.isObject(request.body.response) || !_.isString(request.body.response))) {
            return this.respondWithValidationError('Invalid response!');
        }

        if (!request.body.hasOwnProperty('predicates') || !_.isArray(request.body.predicates)) {
            return this.respondWithValidationError('Invalid predicates!');
        }

        if (request.body.hasOwnProperty('ttl') && !isTtl(request.body.ttl)) {
            return this.respondWithValidationError('Invalid time to life!');
        }

        const items: Stub[] = this.stubRepository.find({serviceId: request.params.serviceId});

        this.stubValidator.validate(request.body, items);

        const stub: Stub = this.stubRepository.create({
            response: request.body.response,
            predicates: request.body.predicates,
            serviceId: request.params.serviceId,
            ttl: ttl,
            expireAt: ttl ? moment().add(ttl, 's').format() : null
        });

        this.respondWithCreated(response, 'api/services/' + request.params.serviceId + '/stubs/' + stub.id);
    }

    /**
     * Get stub
     *
     * @param {Request} request
     * @param {Response} response
     */
    public get(request: SessionRequest, response: Response): void {
        try {
            const stub: Stub = this.stubRepository.get(request.params.stubId);

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
        if (request.body.hasOwnProperty('response') && (!_.isObject(request.body.response) || !_.isString(request.body.response))) {
            return this.respondWithValidationError('Invalid response!');
        }

        if (request.body.hasOwnProperty('predicates') && !_.isArray(request.body.predicates)) {
            return this.respondWithValidationError('Invalid predicates!');
        }

        if (request.body.hasOwnProperty('ttl') && !isTtl(request.body.ttl)) {
            return this.respondWithValidationError('Invalid time to life!');
        }

        const stub: Stub = this.stubRepository.get(request.params.stubId);

        stub.response = request.body.response || stub.response;
        stub.response = request.body.predicates || stub.predicates;

        if (request.body.hasOwnProperty('ttl')) {
            stub.ttl = request.body.ttl;
            stub.expireAt = moment(stub.createAt).add(request.body.ttl).format();
        }

        this.stubRepository.update(stub);
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
        let items: Stub[] = this.stubRepository.find({serviceId: request.params.serviceId});

        this.respondJson(response, items);
    }

    /**
     * Remove all stubs
     *
     * @param {Request} request
     * @param {Response} response
     */
    public removeAll(request: SessionRequest, response: Response): void {
        let searchParams: any = {};

        if (request.params.serviceId) {
            searchParams.serviceId = request.params.serviceId;
        }

        this.stubRepository.findAndRemove(searchParams);

        this.respondWithNoContent(response);
    }
}
