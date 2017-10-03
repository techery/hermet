import config from './config';
import cron from './cron';
import {createProxy} from 'http-proxy';
import {IncomingMessage, ServerResponse} from 'http';
import {PassThrough} from 'stream';
import ProxyError from './errors/ProxyError';
import {proxyHandler as errorHandler, serviceRepository, stubRepository, stubResolver} from './container';
import {ProxyIncomingMessage} from './proxy/interfaces/ProxyIncomingMessage';
import {Stub} from './models/Stub';

//
// Create a proxy server with custom application logic
//
const proxy = createProxy({});

// Start cron job
cron();

/**
 * @param {any[]} stubs
 * @param {ProxyIncomingMessage} request
 * @param {ServerResponse} response
 * @returns {boolean}
 */
function isStubsApplied(stubs: any[], request: ProxyIncomingMessage, response: ServerResponse): boolean {
    let stub: any;

    try {
        stub = stubResolver.resolveStubByRequest(stubs, request);
    } catch (e) {
        throw new ProxyError(400, 'Stub resolving failure');
    }

    if (stub) {
        let statusCode = stub.response.statusCode || 200;
        let headers = stub.response.headers || {};
        let body = stub.response.body || null;

        response.writeHead(statusCode, headers);
        let isJsonBody = body !== null && typeof body === 'object';
        response.end(isJsonBody ? JSON.stringify(body) : body);

        return true;
    }

    return false;
}

proxy.on('error', function (error: any, request: IncomingMessage, response: ServerResponse): void {
    errorHandler.handle(error, request, response);
});

export default async (request: ProxyIncomingMessage, response: ServerResponse) => {
    let service: any;

    try {
        service = serviceRepository.findOne({proxyHost: request.headers.host});
        if (!service) {
            throw new Error('There is no proxy rules for this host:' + request.headers.host);
        }
    } catch (error) {
        const message = 'Can not get proxy rules for host: ' + request.headers.host + '\r\n' + error.message;

        return errorHandler.handle(new ProxyError(400, message), request, response);
    }

    let body: any[] = [];

    request.on('error', function (error: Error): void {
        errorHandler.handle(error, request, response);
    }).on('data', function (chunk: string): void {
        body.push(chunk);
    }).on('end', async function (): Promise<void> {
        let buffer = Buffer.concat(body);

        let bufferStream = new PassThrough();
        bufferStream.end(new Buffer(buffer));

        try {

            let sessionId = request.headers[config.app.session_header] || 'default';
            let stubs: Stub[] = stubRepository.find({
                serviceId: service.id,
                sessionId: sessionId
            });

            let postData = buffer.toString();
            request.body = postData ? JSON.parse(postData) : null;
            request.serviceId = service.id;
            request.sessionId = sessionId;

            if (isStubsApplied(stubs, request, response)) {
                return;
            }

            const options: any = {
                target: service.targetUrl,
                proxyTimeout: service.proxyTimeout || config.proxy.timeout,
                buffer: bufferStream
            };

            proxy.web(request, response, options);

        } catch (error) {
            return errorHandler.handle(error, request, response);
        }
    });
};
