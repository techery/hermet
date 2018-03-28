import { LoggerInstance } from 'winston';
import { IncomingMessage, ServerResponse } from 'http';
import { Request } from 'express';

const curlify = require('request-as-curl');

abstract class Handler {
    protected logger: LoggerInstance;

    public constructor(logger: LoggerInstance) {
        this.logger = logger;
    }

    /**
     * Handle error
     *
     * @param {any} error
     * @param {IncomingMessage} request
     * @param {ServerResponse} response
     */
    public abstract handle(error: any, request: IncomingMessage, response: ServerResponse): void;

    /**
     * Send error message to the client
     *
     * @param {ServerResponse} response
     * @param {number} code
     * @param {string} message
     */
    protected error(response: ServerResponse, code: number, message: string): void {
        response.writeHead(code, {
            'Content-Type': 'application/json'
        });

        response.end(JSON.stringify({ error: message }));
    }

    /**
     * Log error
     *
     * @param {IncomingMessage | Request} request
     * @param {any} error
     */
    protected log(request: any, error: any): void {
        let message = 'Request: ' + curlify(request, request.body || null) + '\r\n';

        if (error instanceof Error) {
            message += error.stack + '\r\n';
        } else {
            message += JSON.stringify(error) + '\r\n';
        }

        this.logger.error(message);
    }
}

export default Handler;
