let uid = require('uid');

abstract class Repository {
    protected abstract collectionName: string;
    protected abstract model: any;
    protected primaryKey: string = 'id';
    protected collection: any;
    protected db: any;

    /**
     * @param {Object} db
     */
    constructor(db: any) {
        let collection = db.getCollection(this.collectionName);

        if (collection === null) {
            collection = db.addCollection(this.collectionName);
        }

        this.db = db;
        this.collection = collection;
    }

    /**
     * @param {Object} data
     *
     * @returns {*}
     */
    public create(data: any): any {
        if (!data.hasOwnProperty(this.primaryKey) || data[this.primaryKey] === null) {
            data[this.primaryKey] = uid();
        }

        return this.toModel(
            this.collection.insert(this.toModel(data))
        );
    }

    /**
     * @param {string} id
     *
     * @returns {object|null}
     */
    public get(id: string): any {
        let query: any = {};
        query[this.primaryKey] = id;

        let item = this.collection.findOne(query);

        if (!item) {
            throw Error('Model not found');
        }

        return this.toModel(this.collection.findOne(query));
    }

    /**
     * @param {Object} query
     *
     * @returns {*}
     */
    public find(query: any): any {
        return this.toModel(this.collection.find(query));
    }

    /**
     * @param {Object} query
     *
     * @returns {object|null}
     */
    public findOne(query: any): any {
        return this.toModel(this.collection.findOne(query));
    }

    /**
     * @param {Object} query
     *
     * @returns {number}
     */
    public count(query: any): any {
        return this.collection.count(query);
    }

    /**
     * @param {Object} model
     *
     * @returns {Object}
     */
    public update(model: any): any {
        return this.toModel(this.collection.update(model));
    }

    /**
     * @param {string} id
     * @param {Object} data
     *
     * @returns {Object}
     */
    public findAndUpdate(id: string, data: any): any {
        let model = this.get(id);

        Object.assign(model, data);

        return this.toModel(this.collection.update(model));
    }

    /**
     * @param {Object} model
     *
     * @returns {void}
     */
    public remove(model: any): void {
        this.collection.remove(model);
    }

    /**
     * @param {Object|Function} query
     *
     * @returns {void}
     */
    public removeWhere(query: any): void {
        this.collection.removeWhere(query);
    }

    /**
     * @param {Object} query
     *
     * @returns {void}
     */
    public findAndRemove(query: any): void {
        this.collection.findAndRemove(query);
    }

    /**
     * @param {Object} query
     *
     * @returns {void}
     */
    public delete(query: any): void {
        this.collection.findAndRemove(query);
    }

    /**
     * @returns {Object[]}
     */
    public all(): any[] {
        return this.toModel(this.collection.find());
    }

    public clear(): void {
        this.collection.clear();
    }

    protected toModel(data: any): any {
        if (Array.isArray(data)) {
            let result: any[] = [];

            data.forEach(item => result.push(this.toModel(item)));

            return result;
        }

        if (data === Object(data)) {
            return new this.model(data);
        }

        return data;
    }
}

export default Repository;
