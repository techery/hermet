import {Request} from 'express';
import {ParsedAsJson} from 'body-parser';

import RequestValidation = ExpressValidator.RequestValidation;
import {SessionInterface} from '../models/SessionInterface';

export interface SessionRequest extends ParsedAsJson, Request, RequestValidation {
    session?: SessionInterface;
}
