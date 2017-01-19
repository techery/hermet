/**
 * Temporary services container
 * TODO: Replace with IoC & providers
 */
import ElasticWrapper from './services/ElasticWrapper';
import ServiceRepository from './repositories/ServiceRepository';
import StubsRepository from './repositories/StubsRepository';
import config from './config';
import {Client} from 'elasticsearch';
import * as winston from 'winston';
import ServicesController from './controllers/ServicesController';
import StubsController from './controllers/StubsController';
import SessionsController from './controllers/SessionsController';
import SessionsRepository from './repositories/SessionsRepository';
import StubResolver from './proxy/StubResolver';
import ProxyHandler from './errors/ProxyHandler';
import AppHandler from './errors/AppHandler';
import ElasticOptionsFactory from './services/ElasticOptonsFactory';
import SessionTransformer from './transformers/SessionTransformer';
import RequestsRepository from './repositories/RequestsRepository';
import ProxyHistory from './proxy/ProxyHistory';
import HistoryController from './controllers/HistoryController';

require('winston-daily-rotate-file');

let elasticsearch = new Client({
    host: config.elasticsearch.host,
    log: config.debug ? 'trace' : 'warning'
});

let elastic = new ElasticWrapper(elasticsearch);
let elasticOptionsFactory = new ElasticOptionsFactory(config.elasticsearch.index);
let serviceRepository = new ServiceRepository(elastic, elasticOptionsFactory);
let stubsRepository = new StubsRepository(elastic, elasticOptionsFactory);
let sessionRepository = new SessionsRepository(elastic, elasticOptionsFactory);
let requestsRepository = new RequestsRepository(elastic, elasticOptionsFactory);

let sessionTransformer = new SessionTransformer();
let servicesController = new ServicesController(serviceRepository, stubsRepository);
let stubsController = new StubsController(stubsRepository);
let sessionController = new SessionsController(sessionRepository, stubsRepository);
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

export {
    elastic,
    elasticOptionsFactory,
    serviceRepository,
    stubsRepository,
    sessionRepository,
    requestsRepository,
    servicesController,
    stubsController,
    sessionController,
    historyController,
    stubResolver,
    proxyHistory,
    appLogger,
    proxyLogger,
    appHandler,
    proxyHandler,
    sessionTransformer
};
