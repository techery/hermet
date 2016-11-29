let couchbaseWrapper = require('../services/CouchbaseWrapper');
const uuid = require('uuid');

let BaseRepository = require('./BaseRepository');

class ServiceRepository extends BaseRepository {

  save(instance) {
    instance._type = this.modelType;
    return couchbaseWrapper.upsert(uuid(), instance);
  }

  all() {
    return couchbaseWrapper.query("SELECT * FROM hermet WHERE _type=$1", [this.modelType]);
  }

  getByProxyHost(proxyHost) {
    return couchbaseWrapper.query("SELECT * FROM hermet WHERE _type=$1 AND proxyHost", [this.modelType, proxyHost]);
  }
}

module.exports = new ServiceRepository("service");
