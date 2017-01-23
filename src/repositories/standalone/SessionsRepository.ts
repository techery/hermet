import BaseRepository from './BaseRepository';
import {Session} from '../../models/Session';

export default class SessionsRepository extends BaseRepository {

    protected type: string = 'session';

    /**
     * @param {string} id
     *
     * @returns {Promise<Session>}
     */
    public get(id: string): Promise<Session> {
        return super.get(id).then((result: Session) => {
            return new Session(result);
        });
    }
}
