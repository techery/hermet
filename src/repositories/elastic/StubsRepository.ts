import BaseRepository from './BaseRepository';
import IndexDocumentParams = Elasticsearch.IndexDocumentParams;
import GetParams = Elasticsearch.GetParams;
import SearchParams = Elasticsearch.SearchParams;

export const MODEL_TYPE_STUB = 'stub';

export default class StubsRepository extends BaseRepository {

    protected getType(): string {
        return MODEL_TYPE_STUB;
    }
}
