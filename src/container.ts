/**
 * Temporary services container
 * TODO: Replace with IoC & providers
 */
import ServiceRepository from './repositories/loki/ServiceRepository';
import StubRepository from './repositories/loki/StubRepository';
import SessionRepository from './repositories/loki/SessionRepository';
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
import StubValidator from './validators/StubValidator';

let loki = require('lokijs');

require('winston-daily-rotate-file');

let db = new loki(config.database.file, {
    autoload: true,
    autosave: true,
    autosaveInterval: 5000
});

let serviceRepository = new ServiceRepository(db);
let stubRepository = new StubRepository(db);
let sessionRepository = new SessionRepository(db);

let sessionTransformer = new SessionTransformer();
let servicesController = new ServicesController(serviceRepository, stubRepository);
let stubsController = new StubsController(stubRepository);
let sessionController = new SessionsController(sessionRepository, stubRepository);
let flushController = new FlushController(serviceRepository, stubRepository, sessionRepository);

let stubResolver = new StubResolver();

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
    stubRepository,
    sessionRepository,
    servicesController,
    stubsController,
    sessionController,
    flushController,
    stubResolver,
    appLogger,
    proxyLogger,
    appHandler,
    proxyHandler,
    sessionTransformer,
    stubValidator
};
