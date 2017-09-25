import BaseRepository from './BaseRepository';
import {Service} from '../../models/Service';

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

    public getServicesByProxyHost(proxyHost: string): Service[] {
        let collection: any = this.getCollection();
        return Object.keys(collection).map((id: string): any => {
            return collection[id];
        }).filter(item => {
            return item.proxyHost === proxyHost;
        });
    }
}
