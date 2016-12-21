import ElasticRepository from './ElasticRepository';

export default class ServiceRepository extends ElasticRepository {
    protected type: string = 'service';
    /**
     * @param {Object} data
     * @returns {Promise}
     */
    public create(data: any): Promise<any> {
        return this.client.create(this.type, data);
    }

    /**
     * @param {string} id
     * @returns {Promise}
     */
    public get(id: string): Promise<any> {
        return this.client.get(this.type, id).then((response: any) => {
            let result = response._source;

            result.id = response._id;

            return result;
        });
    }

    /**
     * @param {string} id
     * @param {Object} data
     * @returns {Promise}
     */
    public update(id: string, data: any): Promise<any> {
        return this.client.update(this.type, id, data);
    }

    /**
     * @param {string} id
     * @returns {Promise}
     */
    public remove(id: string): Promise<any> {
        return this.client.remove(this.type, id);
    }

    /**
     * @returns {Promise}
     */
    public all(): Promise<any> {
        return this.client.search(this.type)
            .then((response: any) => {
                let result: any[] = [];

                response.hits.hits.map((item: any) => {
                    result.push(item._source);

                    return item;
                });

                return result;
            });
    }

    /**
     * @param {string} proxyHost
     * @returns {Promise}
     */
    public getByProxyHost(proxyHost: string): Promise<any> {
        let options = {
            type: this.type,
            body: {
                'query': {
                    'match': {'proxyHost': proxyHost}
                }
            }
        };

        return this.client.searchByOptions(options)
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
