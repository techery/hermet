import uid = require('uid');

abstract class BaseRepository implements Repository {

    protected storage: any;

    protected abstract type: string;
    /**
     * @param storage
     */
    constructor(storage: any) {
        this.storage = storage;
    }

    protected getCollection(): any {
        return this.storage[this.type];
    }

    /**
     * @param {Object} data
     *
     * @returns {any}
     */
    public create(data: any): any {
        return new Promise((resolve, reject) => {
            let newId: string = uid();
            data.id = newId;
            this.getCollection()[newId] = data;

            resolve(data);
        });
    }

    /**
     * @param {string} id
     *
     * @returns {any}
     */
    public get(id: string): any {
        return new Promise((resolve, reject) => {
            let collection: any = this.getCollection();
            if (collection[id]) {
                resolve(collection[id]);
            }
            reject('Not found');
        });
    }

    /**
     * @param {string} id
     * @param {Object} data
     *
     * @returns {Promise}
     */
    public update(id: string, data: any): any {
        return new Promise((resolve, reject) => {
            let collection: any = this.getCollection();
            if (!collection[id]) {
                reject('Not found');
            }

            resolve(Object.keys(data).map(property => {
                collection[id][property] = data[property];
            }));
        });
    }

    /**
     * @param {string} id
     *
     * @returns {Promise}
     */
    public remove(id: string): any {
        return new Promise((resolve, reject) => {
            resolve(delete this.getCollection()[id]);
        });

    }

    /**
     * @returns {Promise}
     */
    public all(params: any = {}): Promise<any[]> {
        return new Promise((resolve, reject) => {
            resolve(this.retrieveItemsByParam(params));
        });

    }

    protected retrieveItemsByParam(params: any = {}): any[] {
        let collection: any = this.getCollection();

        return Object.keys(collection).map((id: string) : any => {
            return collection[id];
        }).filter(item => {
            return Object.keys(params).every((element: any, index: number, array: any[]) => {
                return params[element] === item[element];
            });
        });
    }

    /**
     * @returns {Promise}
     */
    public removeAll(params: any = {}): Promise {
        return new Promise((resolve, reject) => {
            let result: any[] = this.retrieveItemsByParam(params).map((item: any): any => {
                return delete(this.getCollection()[item.id]);
            });
            resolve(result);
        });
    }
}

export default BaseRepository;
