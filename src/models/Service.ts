import {Base} from './Base';

export class Service extends Base {

    public name: string;
    public proxyHost: string;
    public targetUrl: string;

    constructor(params: any) {
        super(params);
        this.name = params.name || null;
        this.proxyHost = params.proxyHost || null;
        this.targetUrl = params.targetUrl || null;
    }
}
