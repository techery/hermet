import { createProxyServer } from 'http-proxy';
import config from './config';
import * as winston from 'winston';
import ServicesController from './controllers/ServicesController';
import StubsController from './controllers/StubsController';
import DocumentationController from './controllers/DocumentationController';
import FlushController from './controllers/FlushController';
import StubResolver from './proxy/StubResolver';
import ProxyHandler from './errors/ProxyHandler';
import AppHandler from './errors/AppHandler';
import StubValidator from './validators/StubValidator';
import ProxyController from './controllers/ProxyController';
import { connect } from 'mongoose';

connect(config.database.uri);

require('winston-daily-rotate-file');

// Create a proxy server with custom application logic
const proxy = createProxyServer();
proxy.on('error', (error: any, request: any, response: any) => proxyHandler.handle(error, request, response));

const appLogger = initLogger(config.log.app);
const proxyLogger = initLogger(config.log.proxy);

const appHandler = new AppHandler(appLogger);
const proxyHandler = new ProxyHandler(proxyLogger);

const stubValidator = new StubValidator();
const stubResolver = new StubResolver();

const servicesController = new ServicesController();
const stubsController = new StubsController(stubValidator);
const flushController = new FlushController();
const documentationController = new DocumentationController();
const proxyController = new ProxyController(proxy, proxyHandler, stubResolver);

function initLogger(file: string): winston.LoggerInstance {
    const level = config.debug ? 'debug' : config.log.level;

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                level: level,
                colorize: true
            }),
            new winston.transports.DailyRotateFile({
                filename: file,
                datePattern: 'yyyy-MM-dd.',
                prepend: true,
                json: false,
                level: level
            })
        ]
    });
}

export {
    servicesController,
    documentationController,
    stubsController,
    flushController,
    appLogger,
    proxyLogger,
    appHandler,
    proxyHandler,
    proxyController
};
