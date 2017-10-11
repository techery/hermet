import * as moment from 'moment';

export class Base {
    public id: string;
    public createAt: string;
    public expireAt: string;
    public ttl: number;

    constructor(params: any = {}) {
        this.id = params.id || null;
        this.ttl = params.ttl || null;
        this.createAt = params.createAt || moment().format();
        this.expireAt = params.expireAt || null;
    }
}
