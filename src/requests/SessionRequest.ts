import {Request} from 'express';
import {ParsedAsJson} from 'body-parser';

import RequestValidation = ExpressValidator.RequestValidation;

export interface SessionRequest extends ParsedAsJson, Request, RequestValidation {}
