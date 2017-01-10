import SearchParams = Elasticsearch.SearchParams;
import ElasticRepository from './ElasticRepository';

export const MODEL_TYPE_SERVICE = 'service';

export default class ServiceRepository extends ElasticRepository {

    protected getType(): string {
        return MODEL_TYPE_SERVICE;
    }

    /**
     * @param {string} proxyHost
     * @returns {Promise}
     */
    public getByProxyHost(proxyHost: string): Promise<any> {

        let options: SearchParams = this.optionsFactory.getSearchParams(this.getType());
        options.body = {
            'query': {
                'term': {'proxyHost': proxyHost}
            }
        };

        return this.client.search(options)
            .then(response => {

                if (response.hits.total === 0) {
                    return null;
                }

                let item = response.hits.hits[0];
                let result = item._source;

                result.id = item._id;

                return result;
            });
    }
}
