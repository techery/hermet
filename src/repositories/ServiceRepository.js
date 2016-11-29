let ProxyRule = require('../models/proxyRule');
let BaseRepository = require('./BaseRepository');

class ServiceRepository extends BaseRepository {}

module.exports = new ServiceRepository(ProxyRule);
