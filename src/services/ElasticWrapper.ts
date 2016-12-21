import {
    Client,
    IndexDocumentParams,
    GetParams,
    UpdateDocumentParams,
    DeleteDocumentParams,
    SearchParams
} from 'elasticsearch';

export default class ElasticWrapper {
    protected client: Client;
    protected index: string;

    /**
     * @param {Client} client
     * @param {string} index
     */
    constructor(client: Client, index: string) {
        this.client = client;
        this.index = index;
    }

    /**
     * @param {*} body
     * @returns {Promise}
     */
    protected promisify(body: any): Promise<any> {
        return new Promise((resolve, reject) => {
            body((error: any, result: any) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }

    /**
     * @param {string} type
     * @param {Object} data
     * @param {string} parentId
     * @returns {Promise}
     */
    public create(type: string, data: any, parentId?: string): Promise<any> {
        return this.promisify((callback: any) => {
            let options: IndexDocumentParams<any> = {index: this.index, type: type, body: data};

            if (parentId) {
                options.parent = parentId;
            }
            options.refresh = 'true';

            this.client.index(options, callback);
        });
    }

    /**
     * @param {string} type
     * @param {string} id
     * @param {string} parentId
     * @returns {Promise}
     */
    public get(type: string, id: string, parentId?: string): Promise<any> {
        let options: GetParams = {index: this.index, type: type, id: id};

        if (parentId) {
            options.parent = parentId;
        }

        return this.promisify((callback: any) => {
            this.client.get(options, callback);
        });
    }

    /**
     * @param {string} type
     * @param {string} id
     * @param {Object} data
     * @param {string} parentId
     * @returns {Promise}
     */
    public update(type: string, id: string, data: any, parentId?: string): Promise<any> {
        let options: UpdateDocumentParams = {
            index: this.index,
            type: type,
            id: id,
            refresh: true,
            body: {
                doc: data
            }
        };

        if (parentId) {
            options.parent = parentId;
        }

        return this.promisify((callback: any) => {
            this.client.update(options, callback);
        });
    }

    /**
     * @param {string} type
     * @param {string} id
     * @param {string} parentId
     * @returns {Promise}
     */
    public remove(type: string, id: string, parentId?: string): Promise<any> {
        let options: DeleteDocumentParams = {index: this.index, type: type, id: id};

        if (parentId) {
            options.parent = parentId;
        }

        return this.promisify((callback: any) => {
            this.client.delete(options, callback);
        });
    }

    /**
     * @param {string} type
     * @param {*} body
     * @returns {Promise}
     */
    public search(type: string, body?: any): Promise<any> {
        let options: SearchParams = {index: this.index, type: type};

        if (body) {
            options.body = body;
        }

        return this.promisify((callback: any) => {
            this.client.search(options, callback);
        });
    }

    /**
     * @param {Object} options
     * @returns {Promise}
     */
    public searchByOptions(options: any): Promise<any> {
        options.index = this.index;

        return this.promisify((callback: any) => {
            this.client.search(options, callback);
        });
    }

    /**
     * @param {string} type
     * @param {*} queryBody
     * @returns {Promise}
     */
    public removeByQuery(type: string, queryBody: any): Promise<any> {
        let options: any = {
            index: this.index,
            type: type,
            conflicts: 'proceed'
        };

        if (queryBody) {
            options.body = queryBody;
        }

        return this.promisify((callback: any) => {
            this.client.deleteByQuery(options, callback);
        });
    }
}
