import * as moment from 'moment';
import * as _ from 'lodash';

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

        // Assign everything else
        Object.assign(this, _.omit(params, _.keys(this)));
    }
}
