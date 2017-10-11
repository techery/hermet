import {Base} from './Base';

export class Session extends Base {

    public name: string;

    constructor(params: any = {}) {
        super(params);
        this.name = params.name || '';
    }
}
