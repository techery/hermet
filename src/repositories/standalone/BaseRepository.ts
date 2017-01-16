let uid = require('uid');

abstract class BaseRepository implements Repository {

    protected storage: any;
    /**
     * @param storage
     */
    constructor(storage: any) {
        this.storage = storage;
    }

    /**
     * @returns string
     */
    protected abstract getType(): string;

    /**
     * @param {Object} data
     *
     * @returns {any}
     */
    public create(data: any): any {
        let newId: string = uid();
        data.id = newId;
        this.storage[this.getType()][newId] = data;

        return data;
    }

    /**
     * @param {string} id
     *
     * @returns {any}
     */
    public get(id: string): any {
        if (this.storage[this.getType()][id]) {
            return this.storage[this.getType()][id];
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
        if (!this.storage[this.getType()][id]) {
            throw new Error('Not found');
        }

        let item = this.storage[this.getType()][id];
        Object.keys(data).map(property => {
            this.storage[this.getType()][id][property] = data[property];
        });
    }

    /**
     * @param {string} id
     *
     * @returns {Promise}
     */
    public remove(id: string): any {
        delete this.storage[this.getType()][id];
    }

    /**
     * @param {Object} params
     *
     * @returns {Promise}
     */
    public all(params: any = {}): any[] {
        let collection: any = this.storage[this.getType()];
        let list: any[] = [];
        Object.keys(collection).map(id => {
            list.push(collection[id]);
        });

        return list;
    }
}

export default BaseRepository;
