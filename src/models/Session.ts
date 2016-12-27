import TimeSpan = Elasticsearch.TimeSpan;
import {SessionInterface} from '../interfaces/models/SessionInterface';
let moment = require('moment');

export class Session implements SessionInterface {
    public id: string;
    public name: string;
    public expireAt: string;
    public ttl: number;

    constructor(params: any) {
        this.id = params.id;
        this.name = params.name || '';
        this.ttl = params.ttl || null;
        this.expireAt = moment().add(this.ttl, 's').format();
    }
}
