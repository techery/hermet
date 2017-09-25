interface Repository {
    /**
     * @param {Object} data
     *
     * @returns {Promise<any>}
     */
    create(data: any): Promise<any>;

    /**
     * @param {string} id
     *
     * @returns {Promise<any>}
     */
    get(id: string): Promise<any>;

    /**
     * @param {string} id
     * @param {Object} data
     *
     * @returns {Promise}
     */
    update(id: string, data: any): Promise;

    /**
     * @param {string} id
     *
     * @returns {Promise}
     */
    remove(id: string): Promise<any>;

    /**
     * @param {Object} params
     *
     * @returns {Promise<any[]>}
     */
    all(params: any = {}): Promise<any[]>;
}
