import * as moment from 'moment';

export class Base {
    public id: string;

    public createAt: string;
    public expireAt: string;
    public ttl: number;

    constructor(params: any) {
        this.id = params.id || null;
        this.ttl = params.ttl || null;
        this.createAt = moment().format();
        this.expireAt = this.ttl ? now.add(this.ttl, 's').format() : null;
    }
}
