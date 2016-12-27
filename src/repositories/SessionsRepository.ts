import ElasticRepository from './ElasticRepository';
import {SessionInterface} from '../interfaces/models/SessionInterface';
import {Session} from '../models/Session';

export const MODEL_TYPE_SESSION = 'session';

export default class SessionsRepository extends ElasticRepository {

    protected getType(): string {
        return MODEL_TYPE_SESSION;
    }

    /**
     * @param {string} id
     *
     * @returns {Promise}
     */
    public get(id: string): Promise<SessionInterface> {
        return super.get(id).then((result: SessionInterface) => {
           return new Session(result);
        });
    }
}
