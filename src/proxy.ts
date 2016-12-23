import config from './config';
import {createProxy} from 'http-proxy';
import {ServerResponse, IncomingMessage} from 'http';
import ProxyError from './errors/ProxyError';
import {
    serviceRepository,
    stubsRepository,
    stubResolver,
    proxyLogger as logger,
    proxyHandler as errorHandler
} from './container';

//
// Create a proxy server with custom application logic
//
const proxy = createProxy({});

/**
 * @param {any[]} stubs
 * @param {IncomingMessage} request
 * @param {ServerResponse} response
 * @returns {boolean}
 */
function isStubsApplied(stubs: any[], request: IncomingMessage, response: ServerResponse): boolean {
    let stub: any = stubResolver.resolveStubByRequest(stubs, request);

    if (stub) {
        let statusCode = stub.response.statusCode || 200;
        let headers = stub.response.headers || {};
        let body = stub.response.body || '';

        response.writeHead(statusCode, headers);
        response.end(body ? JSON.stringify(body) : body);

        return true;
    }

    return false;
}

proxy.on('error', function (error: any, request: IncomingMessage, response: ServerResponse): void {
    errorHandler.handle(error, request, response);
});

export default async (request: IncomingMessage, response: ServerResponse) => {
    let service: any;

    try {
        service = await serviceRepository.getByProxyHost(request.headers.host);
        if (!service) {
            throw new Error('There is no proxy rules for this host:' + request.headers.host);
        }
    } catch (error) {
        const message = 'Can not get proxy rules for host: ' + request.headers.host + '\r\n' + error.message;

        return errorHandler.handle(new ProxyError(400, message), request, response);
    }

    try {
        let sessionId = request.headers[config.app.session_header] || 'default';
        let stubs = await stubsRepository
            .setParentId(service.id)
            .setSessionId(sessionId)
            .all();

        if (isStubsApplied(stubs, request, response)) {
            return;
        }

        const options: any = {
            target: service.targetUrl,
            proxyTimeout: service.proxyTimeout || config.proxy.timeout
        };

        proxy.web(request, response, options);
    } catch (error) {
        return errorHandler.handle(error, request, response);
    }
};
