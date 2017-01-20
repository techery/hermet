import BaseRepository from './BaseRepository';

export const MODEL_TYPE_REQUEST = 'log';

export default class RequestsRepository extends BaseRepository {

    protected getType(): string {
        return MODEL_TYPE_REQUEST;
    }
}
