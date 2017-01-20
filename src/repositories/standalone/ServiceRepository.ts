import BaseRepository from './BaseRepository';

export default class ServiceRepository extends BaseRepository {

    protected type: string = 'service';

    /**
     * @param {string} proxyHost
     * @returns {Promise}
     */
    public getByProxyHost(proxyHost: string): any {
        let collection: any = this.getCollection();
        return Object.keys(collection).map((id: string): any => {
            return collection[id];
        }).find(item => {
            return item.proxyHost === proxyHost;
        });
    }
}
