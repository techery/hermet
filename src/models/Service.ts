export class Service {

    public id: string;
    public name: string;
    public proxyHost: string;
    public targetUrl: string;

    constructor(params: any) {
        this.id = params.id || null;
        this.name = params.name || null;
        this.proxyHost = params.predicates || null;
        this.targetUrl = params.serviceId || null;
    }
}
