import {Response, Request} from 'express';
import config from '../config';
import {sessionRepository} from '../container';
import {SessionRequest} from '../interfaces/requests/SessionRequest';
import {Session} from '../interfaces/models/Session';
import wrap from '../routes/wrapper';

async function sessionMiddleware(req: SessionRequest, res: Response, next: Function): any {

    const sessionId: string = req.get(config.app.session_header);

    if (!sessionId) {
        req.session = {
            id: 'default',
            ttl: 1000
        } as Session;
        return next();
    }

    try {
        req.session = await sessionRepository.get(sessionId) as Session;
        next();
    } catch (err) {
        throw new Error('Session with id [' + sessionId +  '] not found');
    }
}

export default wrap(async (req: SessionRequest, res, next) => sessionMiddleware(req, res, next));
