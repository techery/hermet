import ElasticWrapper from '../services/ElasticWrapper';

abstract class ElasticRepository {

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
    abstract getType(): string;
}

export default ElasticRepository;
