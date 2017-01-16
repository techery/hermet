import BaseRepository from './BaseRepository';
let uid = require('uid');

export const MODEL_TYPE_SERVICE = 'service';

export default class ServiceRepository extends BaseRepository {

    protected getType(): string {
        return MODEL_TYPE_SERVICE;
    }

    /**
     * @param {string} proxyHost
     * @returns {Promise}
     */
    public getByProxyHost(proxyHost: string): any {
        let collection: any[] = this.storage[this.getType()];
        return Object.keys(collection).map(id => {
            return collection[id];
        }).find(item => {
            return item.proxyHost === proxyHost;
        });
    }
}
