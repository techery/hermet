import ElasticWrapper from '../services/ElasticWrapper';
import ElasticOptionsFactory from '../services/ElasticOptonsFactory';

abstract class ElasticRepository {

    protected client: ElasticWrapper;
    protected optionsFactory: ElasticOptionsFactory;
    protected parentId: string = null;
    protected ttl: string = null;

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
     * @param {string} parentId
     *
     * @returns {ElasticRepository}
     */
    public setParentId(parentId: string): this {
        this.parentId = parentId;

        return this;
    }

    /**
     * @param {string} ttl
     *
     * @returns {ElasticRepository}
     */
    public setTtl(ttl: string): this {
        this.ttl = ttl;

        return this;
    }

    /**
     * @param {Object} data
     *
     * @returns {Promise}
     */
    public create(data: any): Promise<any> {
        return this.client.create(
            this.optionsFactory.getIndexParams(this.getType(), data, this.parentId, this.ttl)
        );
    }

    /**
     * @param {string} id
     *
     * @returns {Promise}
     */
    public get(id: string): Promise<any> {
        return this.client.get(
            this.optionsFactory.getGetParams(this.getType(), id, this.parentId)
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
            this.optionsFactory.getUpdateParams(this.getType(), id, data, this.parentId)
        );
    }

    /**
     * @param {string} id
     *
     * @returns {Promise}
     */
    public remove(id: string): Promise<any> {
        return this.client.remove(
            this.optionsFactory.getDeleteParams(this.getType(), id, this.parentId)
        );
    }

    /**
     * @returns {Promise}
     */
    public all(): Promise<any> {
        return this.client.search(
            this.optionsFactory.getSearchParams(this.getType())
        ).then((response: any) => {
            let result: any[] = [];

            response.hits.hits.map((item: any) => {
                result.push(item._source);

                return item;
            });

            return result;
        });
    }
}

export default ElasticRepository;
