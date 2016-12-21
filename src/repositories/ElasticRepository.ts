import ElasticWrapper from '../services/ElasticWrapper';

export default class ElasticRepository {

    protected client: ElasticWrapper;

    /**
     * @param {ElasticWrapper} client
     */
    constructor(client: ElasticWrapper) {
        this.client = client;
    }

    /**
     * @returns string
     */
    protected getType(): string {
        throw new Error('getType method should be redefined in the child class');
    }
}
