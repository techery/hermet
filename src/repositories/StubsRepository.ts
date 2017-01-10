import ElasticRepository from './ElasticRepository';
import IndexDocumentParams = Elasticsearch.IndexDocumentParams;
import GetParams = Elasticsearch.GetParams;
import SearchParams = Elasticsearch.SearchParams;

export const MODEL_TYPE_STUB = 'stub';

export default class StubsRepository extends ElasticRepository {

    protected sessionId: string;
    protected serviceId: string;
    /**
     * @param {string} sessionId
     * @returns {StubsRepository}
     */
    public setSessionId(sessionId: string): StubsRepository {
        this.sessionId = sessionId;

        return this;
    }

    /**
     * @param {string} serviceId
     *
     * @returns {ElasticRepository}
     */
    public setServiceId(serviceId: string): this {
        this.serviceId = serviceId;

        return this;
    }

    /**
     * @returns {Promise}
     */
    public all(): Promise<any> {
        let options: SearchParams = this.optionsFactory.getSearchParams(this.getType());
        options.body = this.prepareSearchBody();

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
    public removeAll(): Promise<any> {
        let options: SearchParams = this.optionsFactory.getDeleteByQueryParams(this.getType());
        options.body = this.prepareSearchBody();

        return this.client.removeByQuery(options);
    }

    /**
     * @returns {Object}
     */
    protected prepareSearchBody(): Object {
        return {
            query: {
                bool: {
                    must: [
                        {
                            term: {
                                sessionId: this.sessionId
                            }
                        },
                        {
                            term: {
                                serviceId: this.serviceId
                            }
                        }
                    ]
                }
            }
        };
    }

    protected getType(): string {
        return MODEL_TYPE_STUB;
    }
}
