import ElasticRepository from './ElasticRepository';

export const MODEL_TYPE_SESSION = 'session';

export default class SessionsRepository extends ElasticRepository {

    protected getType(): string {
        return MODEL_TYPE_SESSION;
    }
}
