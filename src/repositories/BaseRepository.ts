import ElasticRepository from './ElasticRepository';

export default class BaseRepository extends ElasticRepository {

    /**
     * @param {Object} data
     * @returns {Promise}
     */
    public create(data: any): Promise<any> {
        return this.client.create(this.getType(), data);
    }

    /**
     * @param {string} id
     * @returns {Promise}
     */
    public get(id: string): Promise<any> {
        return this.client.get(this.getType(), id).then((response: any) => {
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
        return this.client.update(this.getType(), id, data);
    }

    /**
     * @param {string} id
     * @returns {Promise}
     */
    public remove(id: string): Promise<any> {
        return this.client.remove(this.getType(), id);
    }

    /**
     * @returns {Promise}
     */
    public all(): Promise<any> {
        return this.client.search(this.getType())
            .then((response: any) => {
                let result: any[] = [];

                response.hits.hits.map((item: any) => {
                    result.push(item._source);

                    return item;
                });

                return result;
            });
    }
}
