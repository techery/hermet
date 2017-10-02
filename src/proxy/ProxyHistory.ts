import * as url from 'url';
import RequestsRepository from '../repositories/standalone/RequestsRepository';
import {ProxyIncomingMessage} from './interfaces/ProxyIncomingMessage';
import {ProxyServerResponse} from './interfaces/ProxyServerResponse';

export default class ProxyHistory {

    protected requestsRepository: RequestsRepository;

    constructor(requestsRepository: RequestsRepository) {
        this.requestsRepository = requestsRepository;
    }

    public add(proxyResponse: ProxyServerResponse, request: ProxyIncomingMessage): void {

        let stubData: any = {
            response: {
                body: proxyResponse.body,
                headers: proxyResponse.headers
            },
            predicates: [
                {
                    equals: {
                        method: request.method,
                        path: url.parse(request.url).pathname
                    }
                }
            ],
            serviceId: request.serviceId,
            sessionId: request.sessionId
        };

        if (request.body) {
            stubData.predicates.push({
                equals: {body: request.body},
                caseSensitive: true
            });
        }

        this.requestsRepository.create(stubData);
    }
}
