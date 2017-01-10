import {Request} from 'express';
import {ParsedAsJson} from 'body-parser';

import RequestValidation = ExpressValidator.RequestValidation;
import {Session} from '../models/Session';

export interface SessionRequest extends ParsedAsJson, Request, RequestValidation {
    session?: Session;
}
