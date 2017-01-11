import {Request} from 'express';
import {ParsedAsJson} from 'body-parser';

import {Session} from '../../models/Session';
import RequestValidation = ExpressValidator.RequestValidation;

export interface SessionRequest extends ParsedAsJson, Request, RequestValidation {
    session?: Session;
}
