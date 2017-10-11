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
import DbFsAdapter from './DbFsAdapter';

const loki = require('lokijs');

require('winston-daily-rotate-file');

const db = new loki(config.database.file, {
    autosave: true,
    autosaveInterval: config.database.autosave_interval,
    adapter: new DbFsAdapter()
});

// Load DB synchronously (thanks to the custom DbFsAdapter)
db.loadDatabase();

// Create a proxy server with custom application logic
const proxy = createProxyServer();
proxy.on('error', (error: any, request: any, response: any) => proxyHandler.handle(error, request, response));

const serviceRepository = new ServiceRepository(db);
const stubRepository = new StubRepository(db);
const sessionRepository = new SessionRepository(db);

const appLogger = initLogger(config.log.app);
const proxyLogger = initLogger(config.log.proxy);

const appHandler = new AppHandler(appLogger);
const proxyHandler = new ProxyHandler(proxyLogger);

const stubValidator = new StubValidator();
const stubResolver = new StubResolver();

const sessionTransformer = new SessionTransformer();
const servicesController = new ServicesController(serviceRepository, stubRepository);
const stubsController = new StubsController(stubRepository, stubValidator);
const sessionController = new SessionsController(sessionRepository, stubRepository);
const flushController = new FlushController(serviceRepository, stubRepository, sessionRepository);
const documentationController = new DocumentationController();
const proxyController = new ProxyController(proxy, proxyHandler, serviceRepository, stubResolver);

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
