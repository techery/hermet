import {Response, Request} from 'express';
import BaseController from './BaseController';
import SessionsRepository from '../repositories/elastic/SessionsRepository';
import {sessionTransformer} from '../container';
import {Session} from '../models/Session';
import StubsRepository from '../repositories/elastic/StubsRepository';
import config from '../config';

export default class SessionsController extends BaseController {

    protected sessionsRepository: SessionsRepository;
    protected stubsRepository: StubsRepository;

    /**
     * @param {SessionsRepository} sessionsRepository
     * @param {StubsRepository}    stubsRepository
     */
    constructor(sessionsRepository: SessionsRepository, stubsRepository: StubsRepository) {
        super();
        this.sessionsRepository = sessionsRepository;
        this.stubsRepository = stubsRepository;
    }

    /**
     * Create new session
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async create(request: Request, response: Response): Promise<void> {
        request.body.ttl = request.body.hasOwnProperty('ttl') ? request.body.ttl : config.app.default_session_ttl;
        let session: Session = new Session(request.body);
        let result = await this.sessionsRepository.create(session);

        this.respondWithCreated(response, 'api/sessions/' + result.id);
    }

    /**
     * Get session
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async get(request: Request, response: Response): Promise<void> {
        try {
            let session: Session = await this.sessionsRepository.get(request.params.sessionId);

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
    public async update(request: Request, response: Response): Promise<void> {
        await this.sessionsRepository.update(request.params.sessionId, request.body);
        this.respondWithNoContent(response);
    }

    /**
     * Delete the session
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async remove(request: Request, response: Response): Promise<void> {
        try {
            await this.sessionsRepository.remove(request.params.sessionId);
            await this.stubsRepository.removeAll({
                sessionId: request.params.sessionId
            });
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
    public async list(request: Request, response: Response): Promise<void> {
        let items = await this.sessionsRepository.all();

        this.respondJson(response, items);
    }
}
