import * as url from 'url';
import { proxyLogger as logger } from '../container';
import { ProxyIncomingMessage } from './interfaces/ProxyIncomingMessage';
import Stub from '../models/Stub';
import ProxyError from '../errors/ProxyError';
import { Request, Response } from 'express';

let predicateResolver = require('hermet-predicates');

export default class StubResolver {
    /**
     * Find and apply stub to the request
     *
     * @param {string} serviceId
     * @param {Request} request
     * @param {Response} response
     * @return {Promise}
     */
    public async applyStub(serviceId: string, request: Request, response: Response): Promise<boolean> {
        try {
            let stubs: Stub[] = await Stub.find({ serviceId: serviceId });

            let stub: Stub = this.resolveStubByRequest(stubs, request);

            if (stub) {
                const statusCode = stub.response.statusCode || 200;
                const headers = stub.response.headers || {};
                const body = stub.response.body || null;
                const isJsonBody = body !== null && typeof body === 'object';

                response.status(statusCode)
                    .header(headers)
                    .send(isJsonBody ? JSON.stringify(body) : body);

                return true;
            }

            return false;
        } catch (e) {
            throw new ProxyError(400, 'Stub resolving failure');
        }
    }

    /**
     * Try to get stub for request param satisfying for the stub predicates
     *
     * @param {Stub[]} stubs
     * @param {ProxyIncomingMessage} request Protocol request
     * @returns Object
     */
    protected resolveStubByRequest(stubs: Stub[], request: Request): any {
        return stubs.find((stub: any) => {
            let predicates: any[] = stub.predicates || [];

            if (!predicates.length) {
                return true;
            }

            return predicates.every((predicate: any): boolean => {
                return predicateResolver.resolve(predicate, this.prepareRequest(request), 'utf8', logger);
            });
        });
    }

    /**
     * Create simple request. It is need to optimize normalization during comparing.
     *
     * @param {ProxyIncomingMessage} request Protocol request
     * @returns Object
     */
    private prepareRequest(request: ProxyIncomingMessage): Object {
        const parsedUrl = url.parse(request.url, true);
        return {
            method: request.method,
            path: parsedUrl.pathname,
            headers: request.headers,
            body: request.body,
            query: parsedUrl.query
        };
    }
}
