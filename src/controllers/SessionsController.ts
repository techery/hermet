import {Response, Request} from 'express';
import BaseController from "./BaseController";
import SessionsRepository from "../repositories/SessionsRepository";

export default class SessionsController extends BaseController {

    protected sessionsRepository: SessionsRepository;

    /**
     * @param {SessionsRepository} sessionsRepository
     */
    constructor(sessionsRepository: SessionsRepository) {
        super();
        this.sessionsRepository = sessionsRepository;
    }

    /**
     * Create new session
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async create(request: Request, response: Response): Promise<void> {
        let result = await this.sessionsRepository.create(request.body);

        this.respondWithCreated(response, '/sessions/' + result._id);
    }

    /**
     * Get session
     *
     * @param {Request} request
     * @param {Response} response
     */
    public async get(request: Request, response: Response): Promise<void> {
        try {
            let item = await this.sessionsRepository.get(request.params.sessionId);

            this.respondJson(response, item);
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
