import {Response} from 'express';
import config from '../config';
import {sessionRepository} from '../container';
import {SessionRequest} from '../interfaces/requests/SessionRequest';
import {Session} from '../interfaces/models/Session';
import wrap from '../routes/wrapper';

async function sessionMiddleware(request: SessionRequest, response: Response, next: Function): Promise<any> {

    const sessionId: string = request.get(config.app.session_header);

    if (!sessionId) {
        request.session = {
            id: 'default',
            ttl: 1000
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
