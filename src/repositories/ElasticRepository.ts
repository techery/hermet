import ElasticWrapper from '../services/ElasticWrapper';

export default class ElasticRepository {
    protected client: ElasticWrapper;

    /**
     * @param {ElasticWrapper} client
     */
    constructor(client: ElasticWrapper) {
        this.client = client;
    }
}
