import ElasticWrapper from '../services/ElasticWrapper';
import ElasticOptionsFactory from '../services/ElasticOptonsFactory';
import SearchParams = Elasticsearch.SearchParams;

abstract class ElasticRepository {

    protected client: ElasticWrapper;
    protected optionsFactory: ElasticOptionsFactory;

    /**
     * @param {ElasticWrapper} client
     * @param {ElasticOptionsFactory} optionsFactory
     */
    constructor(client: ElasticWrapper, optionsFactory: ElasticOptionsFactory) {
        this.client = client;
        this.optionsFactory = optionsFactory;
    }

    /**
     * @returns string
     */
    protected abstract getType(): string;

    /**
     * @param {Object} data
     *
     * @returns {Promise}
     */
    public create(data: any): Promise<any> {
        return this.client.create(
            this.optionsFactory.getIndexParams(this.getType(), data)
        );
    }

    /**
     * @param {string} id
     *
     * @returns {Promise}
     */
    public get(id: string): Promise<any> {
        return this.client.get(
            this.optionsFactory.getGetParams(this.getType(), id)
        ).then((response: any) => {
            let result = response._source;

            result.id = response._id;

            return result;
        });
    }

    /**
     * @param {string} id
     * @param {Object} data
     *
     * @returns {Promise}
     */
    public update(id: string, data: any): Promise<any> {
        return this.client.update(
            this.optionsFactory.getUpdateParams(this.getType(), id, data)
        );
    }

    /**
     * @param {string} id
     *
     * @returns {Promise}
     */
    public remove(id: string): Promise<any> {
        return this.client.remove(
            this.optionsFactory.getDeleteParams(this.getType(), id)
        );
    }

    /**
     * @param {Object} params
     *
     * @returns {Promise}
     */
    public all(params: any = {}): Promise<any> {
        let options: SearchParams = this.optionsFactory.getSearchParams(this.getType());
        options.body = this.prepareSearchBody(params);

        return this.client.search(options).then((response: any) => {
            let result: any[] = [];

            response.hits.hits.map((item: any) => {
                result.push(item._source);

                return item;
            });

            return result;
        });
    }

    /**
     * @param {Object} params
     *
     * @returns {Object}
     */
    protected prepareSearchBody(params: any = {}): Object {
        let queryParams: any[] = [];

        Object.keys(params).map(key => {
            let term: any = {};
            term[key] = params[key];
            queryParams.push({
                term: term
            });
        });

        if (!queryParams.length) {
            return {};
        }

        return {
            query: {
                bool: {
                    must: queryParams
                }
            }
        };
    }
}

export default ElasticRepository;
