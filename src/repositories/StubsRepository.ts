import ElasticRepository from './ElasticRepository';

export default class StubsRepository extends ElasticRepository {
    protected sessionId: string = 'default';
    protected serviceId: string;
    protected type: string = 'stub';

    /**
     * @param {string} serviceId
     * @returns {StubsRepository}
     */
    public setServiceId(serviceId: string): StubsRepository {
        this.serviceId = serviceId;

        return this;
    }

    /**
     * @param {string} sessionId
     * @returns {StubsRepository}
     */
    public setSessionId(sessionId: string): StubsRepository {
        this.sessionId = sessionId;

        return this;
    }

    /**
     * @param {Object} data
     * @returns {Promise}
     */
    public create(data: any): Promise<any> {
        data.sessionId = this.sessionId;

        return this.client.create(this.type, data, this.serviceId);
    }

    /**
     * @param {string} id
     * @returns {Promise}
     */
    public get(id: string): Promise<any> {
        return this.client.get(this.type, id, this.serviceId).then((response: any) => {
            let result: any = response._source;

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
        data.sessionId = this.sessionId;

        return this.client.update(this.type, id, data, this.serviceId);
    }

    /**
     * @param {string} id
     * @returns {Promise}
     */
    public remove(id: string): Promise<any> {
        return this.client.remove(this.type, id, this.serviceId);
    }

    /**
     * @returns {Promise}
     */
    public all(): Promise<any> {
        return this.client.search(this.type, this.prepareSearchParams())
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
        return this.client.removeByQuery(this.type, this.prepareSearchParams());
    }

    /**
     * @returns {Object}
     */
    protected prepareSearchParams(): Object {
        return {
            query: {
                bool: {
                    filter: [
                        {
                            match: {
                                sessionId: this.sessionId
                            }
                        },
                        {
                            parent_id: {
                                type: this.type,
                                id: this.serviceId
                            }
                        }
                    ]
                }
            }
        };
    }
}
