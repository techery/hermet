/**
 * Temporary services container
 * TODO: Replace with IoC & providers
 */
import {createProxyServer} from 'http-proxy';
import ServiceRepository from './repositories/loki/ServiceRepository';
import StubRepository from './repositories/loki/StubRepository';
import SessionRepository from './repositories/loki/SessionRepository';
import config from './config';
import * as winston from 'winston';
import ServicesController from './controllers/ServicesController';
import StubsController from './controllers/StubsController';
import SessionsController from './controllers/SessionsController';
import DocumentationController from './controllers/DocumentationController';
import FlushController from './controllers/FlushController';
import StubResolver from './proxy/StubResolver';
import ProxyHandler from './errors/ProxyHandler';
import AppHandler from './errors/AppHandler';
import SessionTransformer from './transformers/SessionTransformer';
import StubValidator from './validators/StubValidator';
import ProxyController from './controllers/ProxyController';

let loki = require('lokijs');

require('winston-daily-rotate-file');

let db = new loki(config.database.file, {
    autoload: true,
    autosave: true,
    autosaveInterval: config.database.autosave_interval
});

// Create a proxy server with custom application logic
const proxy = createProxyServer();
proxy.on('error', (error: any, request: any, response: any) => proxyHandler.handle(error, request, response));

let serviceRepository = new ServiceRepository(db);
let stubRepository = new StubRepository(db);
let sessionRepository = new SessionRepository(db);

let appLogger = initLogger(config.log.app);
let proxyLogger = initLogger(config.log.proxy);

let appHandler = new AppHandler(appLogger);
let proxyHandler = new ProxyHandler(proxyLogger);

let stubValidator = new StubValidator();
let stubResolver = new StubResolver();

let sessionTransformer = new SessionTransformer();
let servicesController = new ServicesController(serviceRepository, stubRepository);
let stubsController = new StubsController(stubRepository, stubValidator);
let sessionController = new SessionsController(sessionRepository, stubRepository);
let flushController = new FlushController(serviceRepository, stubRepository, sessionRepository);
let documentationController = new DocumentationController();
let proxyController = new ProxyController(proxy, proxyHandler, serviceRepository, stubResolver);

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
    serviceRepository,
    stubRepository,
    sessionRepository,
    servicesController,
    documentationController,
    stubsController,
    sessionController,
    flushController,
    appLogger,
    proxyLogger,
    appHandler,
    proxyHandler,
    sessionTransformer,
    proxyController
};
