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

    /**
     * @param {Client} client
     */
    constructor(client: Client) {
        this.client = client;
    }

    /**
     * @param {*} body
     *
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
     * @param {IndexDocumentParams<any>} options
     *
     * @returns {Promise}
     */
    public create(options: IndexDocumentParams<any>): Promise<any> {
        return this.promisify((callback: any) => {
            this.client.index(options, callback);
        });
    }

    /**
     * @param {GetParams} options
     *
     * @returns {Promise}
     */
    public get(options: GetParams): Promise<any> {
        return this.promisify((callback: any) => {
            this.client.get(options, callback);
        });
    }

    /**
     * @param {UpdateDocumentParams} options
     *
     * @returns {Promise}
     */
    public update(options: UpdateDocumentParams): Promise<any> {
        return this.promisify((callback: any) => {
            this.client.update(options, callback);
        });
    }

    /**
     * @param {DeleteDocumentParams} options
     *
     * @returns {Promise}
     */
    public remove(options: DeleteDocumentParams): Promise<any> {
        return this.promisify((callback: any) => {
            this.client.delete(options, callback);
        });
    }

    /**
     * @param {SearchParams} options
     *
     * @returns {Promise}
     */
    public search(options: SearchParams): Promise<any> {
        return this.promisify((callback: any) => {
            this.client.search(options, callback);
        });
    }

    /**
     * @param {any} options
     * @returns {Promise}
     */
    public removeByQuery(options: any): Promise<any> {
        return this.promisify((callback: any) => {
            this.client.deleteByQuery(options, callback);
        });
    }
}
