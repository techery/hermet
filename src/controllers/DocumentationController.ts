import {Request, Response} from 'express';
import BaseController from './BaseController';
import config from '../config';
import * as fs from 'fs';

let yaml = require('yamljs');

export default class DocumentationController extends BaseController {
    /**
     * @param {Request} request
     * @param {Response} response
     */
    public show(request: Request, response: Response): any {
        let documentation = yaml.load(config.api.documentation);
        let ui: string = fs.readFileSync('documents/swagger/swagger.html').toString();

        response.send(ui.replace('{{specification}}', JSON.stringify(documentation)));
    }
}
