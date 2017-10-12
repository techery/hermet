import * as moment from 'moment';

export class Base {
    public $loki: string;
    public id: string;
    public createAt: string;
    public expireAt: string;
    public ttl: number;

    constructor(params: any = {}) {
        if (params.$loki) {
            this.$loki = params.$loki
        }

        this.id = params.id || null;
        this.ttl = params.ttl || null;
        this.createAt = params.createAt || moment().format();
        this.expireAt = params.expireAt || null;
    }
}
