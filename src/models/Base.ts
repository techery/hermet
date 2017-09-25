import * as moment from 'moment';

export class Base {
    public id: string;

    public createAt: string;
    public expireAt: string;
    public ttl: number;

    constructor(params: any) {
        const now = moment();
        this.id = params.id || null;
        this.ttl = params.ttl || null;
        this.createAt = now.format();
        this.expireAt = this.ttl ? now.add(this.ttl, 's').format() : null;
    }
}
