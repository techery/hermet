import ElasticRepository from './ElasticRepository';
import IndexDocumentParams = Elasticsearch.IndexDocumentParams;
import GetParams = Elasticsearch.GetParams;
import SearchParams = Elasticsearch.SearchParams;

export const MODEL_TYPE_STUB = 'stub';

export default class StubsRepository extends ElasticRepository {

    /**
     * @returns {Promise}
     */
    public all(params: any = {}): Promise<any> {
        let options: SearchParams = this.optionsFactory.getSearchParams(this.getType());
        options.body = this.prepareSearchBody(params);

        return this.client.search(options)
            .then((response: any) => {
                let result: any[] = [];

                response.hits.hits.map((item: any) => {
                    item._source.id = item._id;
                    result.push(item._source);

                    return item;
                });

                return result;
            });
    }

    /**
     * @returns {Promise}
     */
    public removeAll(params: any = {}): Promise<any> {
        let options: SearchParams = this.optionsFactory.getDeleteByQueryParams(this.getType());
        options.body = this.prepareSearchBody(params);

        return this.client.removeByQuery(options);
    }

    protected getType(): string {
        return MODEL_TYPE_STUB;
    }
}
