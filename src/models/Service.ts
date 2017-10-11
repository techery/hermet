import {Base} from './Base';

export class Service extends Base {

    public name: string;
    public targetUrl: string;

    constructor(params: any = {}) {
        super(params);
        this.name = params.name || null;
        this.targetUrl = params.targetUrl || null;
    }
}
