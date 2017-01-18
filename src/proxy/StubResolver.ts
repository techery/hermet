import * as url from 'url';
import {proxyLogger as logger} from '../container';
import {ProxyIncomingMessage} from './ProxyIncomingMessage';

let predicateResolver = require('hermet-predicates');

export default class StubResolver {
    /**
     * Create simple request. It is need to optimize normalization during comparing.
     *
     * @param {ProxyIncomingMessage} request Protocol request
     * @returns Object
     */
    private prepareRequest(request: ProxyIncomingMessage): Object {
        return {
            method: request.method,
            path: url.parse(request.url).pathname,
            headers: request.headers,
            body: request.body
        };
    }

    /**
     * Try to get stub for request param satisfying for the stub predicates
     *
     * @param {any[]} stubs Map(id, stub)
     * @param {ProxyIncomingMessage} request     Protocol request
     * @returns Object
     */
    public resolveStubByRequest(stubs: any[], request: ProxyIncomingMessage): any {
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
}
