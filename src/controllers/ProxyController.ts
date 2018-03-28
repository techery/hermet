import {NextFunction, Request, Response} from 'express';
import BaseController from './BaseController';
import config from '../config';
import {PassThrough} from 'stream';
import ProxyError from '../errors/ProxyError';
import {Service} from '../models/Service';
import ProxyHandler from '../errors/ProxyHandler';
import * as url from 'url';
import ServiceRepository from '../repositories/loki/ServiceRepository';
import StubResolver from '../proxy/StubResolver';

export default class ProxyController extends BaseController {
    protected proxyServer: any;
    protected subdomainLevel: number;
    protected serviceRepository: ServiceRepository;
    protected errorHandler: ProxyHandler;
    protected stubResolver: StubResolver;

    constructor(
        proxyServer: any,
        errorHandler: ProxyHandler,
        serviceRepository: ServiceRepository,
        stubResolver: StubResolver
    ) {
        super();
        this.proxyServer = proxyServer;
        this.errorHandler = errorHandler;
        this.serviceRepository = serviceRepository;
        this.stubResolver = stubResolver;

        const baseUrl = url.parse(config.app.base_url);
        this.subdomainLevel = baseUrl.hostname.split('.').length - 2;
    }

    /**
     * @param {Request} request
     * @param {Response} response
     * @param {NextFunction} next
     */
    public proxy(request: Request, response: Response, next: NextFunction): any {
        const serviceName: string = request.subdomains[this.subdomainLevel];

        if (!serviceName) {
            return next();
        }

        const service: Service = this.serviceRepository.findOne({name: serviceName.toLowerCase()});
        if (!service) {
            const error = new ProxyError(400, 'Service "' + serviceName + '" not found');

            return this.errorHandler.handle(error, request, response);
        }

        let body: any[] = [];

        request.on('error', (error: Error) => {
            this.errorHandler.handle(error, request, response);
        }).on('data', (chunk: string) => {
            body.push(chunk);
        }).on('end', () => {
            const buffer = Buffer.concat(body);
            const bufferStream = new PassThrough();
            bufferStream.end(new Buffer(buffer));

            try {
                let postData = buffer.toString();
                request.body = postData ? JSON.parse(postData) : null;

                if (this.stubResolver.applyStub(service.id, request, response)) {
                    return;
                }

                this.proxyServer.web(request, response, {
                    target: service.targetUrl,
                    proxyTimeout: config.proxy.timeout,
                    buffer: bufferStream,
                    changeOrigin: true
                });
            } catch (error) {
                return this.errorHandler.handle(error, request, response);
            }
        });
    }
}
