import { Request, Response } from 'express';
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
        let ui = fs.readFileSync(config.api.swagger).toString();

        documentation.servers = documentation.servers || [];
        documentation.servers.push({ url: config.app.base_url });

        response.send(ui.replace('{{specification}}', JSON.stringify(documentation)));
    }
}
