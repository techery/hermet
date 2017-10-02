/**
 * Temporary services container
 * TODO: Replace with IoC & providers
 */
import InMemoryServiceRepository from './repositories/standalone/ServiceRepository';
import InMemoryStubsRepository from './repositories/standalone/StubsRepository';
import InMemorySessionsRepository from './repositories/standalone/SessionsRepository';
import InMemoryRequestsRepository from './repositories/standalone/RequestsRepository';
import config from './config';
import * as winston from 'winston';
import ServicesController from './controllers/ServicesController';
import StubsController from './controllers/StubsController';
import SessionsController from './controllers/SessionsController';
import FlushController from './controllers/FlushController';
import StubResolver from './proxy/StubResolver';
import ProxyHandler from './errors/ProxyHandler';
import AppHandler from './errors/AppHandler';
import SessionTransformer from './transformers/SessionTransformer';
import ProxyHistory from './proxy/ProxyHistory';
import HistoryController from './controllers/HistoryController';
import StubValidator from './validators/StubValidator';

require('winston-daily-rotate-file');

let storage = {
    service: {},
    session: {},
    stub: {},
    log: {}
};

let serviceRepository = new InMemoryServiceRepository(storage);
let stubsRepository = new InMemoryStubsRepository(storage);
let sessionRepository = new InMemorySessionsRepository(storage);
let requestsRepository = new InMemoryRequestsRepository(storage);

let sessionTransformer = new SessionTransformer();
let servicesController = new ServicesController(serviceRepository, stubsRepository);
let stubsController = new StubsController(stubsRepository);
let sessionController = new SessionsController(sessionRepository, stubsRepository);
let flushController = new FlushController(storage);
let historyController = new HistoryController(requestsRepository);

let stubResolver = new StubResolver();
let proxyHistory = new ProxyHistory(requestsRepository);

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

let appLogger = initLogger(config.log.app);
let proxyLogger = initLogger(config.log.proxy);

let appHandler = new AppHandler(appLogger);
let proxyHandler = new ProxyHandler(proxyLogger);

let stubValidator = new StubValidator();

export {
    serviceRepository,
    storage,
    stubsRepository,
    sessionRepository,
    requestsRepository,
    servicesController,
    stubsController,
    sessionController,
    flushController,
    historyController,
    stubResolver,
    proxyHistory,
    appLogger,
    proxyLogger,
    appHandler,
    proxyHandler,
    sessionTransformer,
    stubValidator
};
