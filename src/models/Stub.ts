import {Base} from './Base';

export class Stub extends Base {

    public response: any;
    public predicates: any;
    public serviceId: string;
    public sessionId: string;

    constructor(params: any = {}) {
        super(params);
        this.response = params.response || {};
        this.predicates = params.predicates || [];
        this.serviceId = params.serviceId || null;
        this.sessionId = params.sessionId || null;
    }
}
