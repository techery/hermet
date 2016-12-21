/**
 * Temporary services container
 * TODO: Replace with IoC & providers
 */
import ElasticWrapper from './services/ElasticWrapper';
import ServiceRepository from './repositories/ServiceRepository';
import StubsRepository from './repositories/StubsRepository';
import config from './config';
import {Client} from 'elasticsearch';
import ServicesController from './controllers/ServicesController';
import StubsController from './controllers/StubsController';

let elasticsearch = new Client({
    host: 'localhost:9200',
    log: 'trace'
});
let elastic = new ElasticWrapper(elasticsearch, config.elasticsearch.index);
let serviceRepository = new ServiceRepository(elastic);
let stubsRepository = new StubsRepository(elastic);

let servicesController = new ServicesController(serviceRepository);
let stubsController = new StubsController(stubsRepository);

export {
    elastic,
    serviceRepository,
    stubsRepository,
    servicesController,
    stubsController
};
