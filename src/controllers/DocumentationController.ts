import {Request, Response} from 'express';
import BaseController from './BaseController';
import config from '../config';

let yaml = require('yamljs');

export default class DocumentationController extends BaseController {
    /**
     * @param {Request} request
     * @param {Response} response
     */
    public show(request: Request, response: Response): any {
        let documentation = yaml.load(config.api.documentation);
        this.respondJson(response, documentation);
    }
}
