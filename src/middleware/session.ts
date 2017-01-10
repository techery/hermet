import {Response} from 'express';
import config from '../config';
import {sessionRepository} from '../container';
import {SessionRequest} from '../requests/SessionRequest';
import wrap from '../routes/wrapper';
import {Session} from '../models/Session';

async function sessionMiddleware(request: SessionRequest, response: Response, next: Function): Promise<any> {

    const sessionId: string = request.get(config.app.session_header);

    if (!sessionId) {
        request.session = {
            id: 'default',
            name: 'Default session',
            expireAt: null
        } as Session;
        return next();
    }

    try {
        request.session = await sessionRepository.get(sessionId) as Session;
        next();
    } catch (err) {
        throw new Error('Session with id [' + sessionId +  '] not found');
    }
}

export default wrap(
    async (request: SessionRequest, response: Response, next: Function) => sessionMiddleware(request, response, next)
);
