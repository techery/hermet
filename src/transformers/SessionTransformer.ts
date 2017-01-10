import {Session} from '../models/Session';

export default class SessionTransformer {
    public transform(session: Session): any {
        return {
            id: session.id,
            name: session.name,
            ttl: session.ttl,
            expireAt: session.expireAt
        };
    }
}
