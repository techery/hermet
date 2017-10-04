import Repository from './Repository';
import {Session} from '../../models/Session';

export default class SessionRepository extends Repository {
    protected collectionName: string = 'session';
    protected model: any = Session;
}
