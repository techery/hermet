import Handler from './Handler';
import {ServerResponse, IncomingMessage} from 'http';
import ProxyError from './ProxyError';

export default class ProxyHandler extends Handler {
    /**
     * Handle proxy server error
     *
     * @param {any} error
     * @param {IncomingMessage} request
     * @param {ServerResponse} response
     */
    public handle(error: any, request: IncomingMessage, response: ServerResponse): void {
        this.log(request, error);

        if (error instanceof ProxyError) {
            this.error(response, error.httpCode, error.message);
        }

        this.error(response, 500, 'ProxyError');
    }
}
