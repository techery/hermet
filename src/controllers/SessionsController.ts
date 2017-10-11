import {Response, Request} from 'express';
import BaseController from './BaseController';
import SessionRepository from '../repositories/loki/SessionRepository';
import {sessionTransformer} from '../container';
import {Session} from '../models/Session';
import config from '../config';
import StubRepository from '../repositories/loki/StubRepository';
import * as moment from 'moment';
import isTtl from '../validators/TtlValidator';

export default class SessionsController extends BaseController {

    protected sessionRepository: SessionRepository;
    protected stubRepository: StubRepository;

    /**
     * @param {SessionRepository} sessionRepository
     * @param {StubRepository}    stubRepository
     */
    constructor(sessionRepository: SessionRepository, stubRepository: StubRepository) {
        super();
        this.sessionRepository = sessionRepository;
        this.stubRepository = stubRepository;
    }

    /**
     * Create new session
     *
     * @param {Request} request
     * @param {Response} response
     */
    public create(request: Request, response: Response): void {
        const ttl = request.body.hasOwnProperty('ttl') ? request.body.ttl : config.app.default_session_ttl;

        if (!request.body.hasOwnProperty('name') || !/[\w\d-_]{3,}/.test(request.body.name)) {
            return this.respondWithValidationError('Invalid session name format!');
        }

        if (request.body.hasOwnProperty('ttl') && !isTtl(request.body.ttl)) {
            return this.respondWithValidationError('Invalid time to life!');
        }

        const session: Session = this.sessionRepository.create({
            name: request.body.name,
            ttl: ttl,
            expireAt: ttl ? moment().add(ttl, 's').format() : null
        });

        this.respondWithCreated(response, 'api/sessions/' + session.id);
    }

    /**
     * Get session
     *
     * @param {Request} request
     * @param {Response} response
     */
    public get(request: Request, response: Response): void {
        try {
            const session: Session = this.sessionRepository.get(request.params.sessionId);

            this.respondJson(response, sessionTransformer.transform(session));
        } catch (err) {
            this.respondWithNotFound();
        }
    }

    /**
     * Update session
     *
     * @param {Request} request
     * @param {Response} response
     */
    public update(request: Request, response: Response): void {
        if (request.body.hasOwnProperty('name') && !/[\w\d-_]{3,}/.test(request.body.name)) {
            return this.respondWithValidationError('Invalid session name format!');
        }

        if (request.body.hasOwnProperty('ttl') && !isTtl(request.body.ttl)) {
            return this.respondWithValidationError('Invalid time to life!');
        }
        const session: Session = this.sessionRepository.get(request.params.sessionId);

        session.name = request.body.name || session.name;

        if (request.body.hasOwnProperty('ttl')) {
            session.ttl = request.body.ttl;
            session.expireAt = moment(session.createAt).add(request.body.ttl).format();
        }

        this.sessionRepository.update(session);

        this.respondWithNoContent(response);
    }

    /**
     * Delete the session
     *
     * @param {Request} request
     * @param {Response} response
     */
    public remove(request: Request, response: Response): void {
        try {
            this.sessionRepository.delete({id: request.params.sessionId});
            this.stubRepository.delete({sessionId: request.params.sessionId});
            this.respondWithNoContent(response);
        } catch (err) {
            this.respondWithNotFound();
        }
    }

    /**
     * Get session list
     *
     * @param {Request} request
     * @param {Response} response
     */
    public list(request: Request, response: Response): void {
        let items: Session[] = this.sessionRepository.all();

        this.respondJson(response, items);
    }
}
