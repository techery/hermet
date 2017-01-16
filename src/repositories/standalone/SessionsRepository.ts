import BaseRepository from './BaseRepository';
import {Session} from '../../models/Session';

export const MODEL_TYPE_SESSION = 'session';

export default class SessionsRepository extends BaseRepository {

    protected getType(): string {
        return MODEL_TYPE_SESSION;
    }

    /**
     * @param {string} id
     *
     * @returns {Session}
     */
    public get(id: string): Session {
        let sessionData: any = super.get(id);
        return new Session(sessionData);
    }
}
