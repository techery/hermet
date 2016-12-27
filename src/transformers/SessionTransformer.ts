import {SessionInterface} from '../interfaces/models/SessionInterface';

export default class SessionTransformer {
    public transform(session: SessionInterface): any {
        return {
            id: session.id,
            name: session.name,
            ttl: session.ttl,
            expireAt: session.expireAt
        };
    }
}
