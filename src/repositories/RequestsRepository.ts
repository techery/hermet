import ElasticRepository from './ElasticRepository';

export const MODEL_TYPE_REQUEST = 'log';

export default class RequestsRepository extends ElasticRepository {

    protected getType(): string {
        return MODEL_TYPE_REQUEST;
    }
}
