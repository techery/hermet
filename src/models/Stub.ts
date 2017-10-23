import {Base} from './Base';

export class Stub extends Base {

    public response: any;
    public predicates: any;
    public serviceId: string;

    constructor(params: any = {}) {
        super(params);
        this.response = params.response || {};
        this.predicates = params.predicates || [];
        this.serviceId = params.serviceId || null;
    }
}
