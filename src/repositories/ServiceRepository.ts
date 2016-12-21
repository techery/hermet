import BaseRepository from './BaseRepository';

export const MODEL_TYPE_SERVICE = 'service';

export default class ServiceRepository extends BaseRepository {

    protected getType(): string {
        return MODEL_TYPE_SERVICE;
    }

    /**
     * @param {string} proxyHost
     * @returns {Promise}
     */
    public getByProxyHost(proxyHost: string): Promise<any> {
        let options = {
            type: this.getType(),
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
