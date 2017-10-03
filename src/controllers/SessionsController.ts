import {Response, Request} from 'express';
import BaseController from './BaseController';
import SessionRepository from '../repositories/loki/SessionRepository';
import {sessionTransformer} from '../container';
import {Session} from '../models/Session';
import config from '../config';
import StubRepository from '../repositories/loki/StubRepository';

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
        request.body.ttl = request.body.hasOwnProperty('ttl') ? request.body.ttl : config.app.default_session_ttl;
        let session: Session = new Session(request.body);
        let result = this.sessionRepository.create(session);

        this.respondWithCreated(response, 'api/sessions/' + result.id);
    }

    /**
     * Get session
     *
     * @param {Request} request
     * @param {Response} response
     */
    public get(request: Request, response: Response): void {
        try {
            let session: Session = this.sessionRepository.get(request.params.sessionId);

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
        this.sessionRepository.findAndUpdate(request.params.sessionId, request.body);
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
