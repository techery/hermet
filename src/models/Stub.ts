
export class Stub {
    public id: string;
    public response: any;
    public predicates: any;
    public serviceId: string;
    public sessionId: string;
    public expireAt: string;

    constructor(params: any) {
        this.id = params.id || null;
        this.response = params.response || {};
        this.predicates = params.predicates || [];
        this.serviceId = params.serviceId || null;
        this.sessionId = params.sessionId || null;
        this.expireAt = params.expireAt || null;
    }
}
