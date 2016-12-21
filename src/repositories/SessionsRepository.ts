import BaseRepository from './BaseRepository';

export const MODEL_TYPE_SESSION = 'session';

export default class SessionsRepository extends BaseRepository {

    protected getType(): string {
        return MODEL_TYPE_SESSION;
    }
}
