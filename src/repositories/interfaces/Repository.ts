interface Repository {
    getType(): string;

    /**
     * @param {Object} data
     *
     * @returns {any}
     */
    create(data: any): any;

    /**
     * @param {string} id
     *
     * @returns {any}
     */
    get(id: string): any;

    /**
     * @param {string} id
     * @param {Object} data
     *
     * @returns {Promise}
     */
    update(id: string, data: any): any;

    /**
     * @param {string} id
     *
     * @returns {Promise}
     */
    remove(id: string): any;

    /**
     * @param {Object} params
     *
     * @returns {Promise}
     */
    all(params: any = {}): any[];
}
