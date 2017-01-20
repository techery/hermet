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
        let newId: string = uid();
        data.id = newId;
        this.getCollection()[newId] = data;

        return data;
    }

    /**
     * @param {string} id
     *
     * @returns {any}
     */
    public get(id: string): any {
        let collection: any = this.getCollection();
        if (collection[id]) {
            return collection[id];
        }
        throw new Error('Not found');
    }

    /**
     * @param {string} id
     * @param {Object} data
     *
     * @returns {Promise}
     */
    public update(id: string, data: any): any {
        let collection: any = this.getCollection();
        if (!collection[id]) {
            throw new Error('Not found');
        }

        let item = collection[id];
        Object.keys(data).map(property => {
            collection[id][property] = data[property];
        });
    }

    /**
     * @param {string} id
     *
     * @returns {Promise}
     */
    public remove(id: string): any {
        delete this.getCollection()[id];
    }

    /**
     * @returns {Promise}
     */
    public all(params: any = {}): any[] {
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
    public removeAll(params: any = {}): any {
        this.all(params).map((item: any): void => {
            delete(this.getCollection()[item.id]);
        });
    }
}

export default BaseRepository;
