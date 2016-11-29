let BaseRepository = require('./BaseRepository');
let couchbaseWrapper = require('../services/CouchbaseWrapper');
const uuid = require('uuid');

class StubsRepository extends BaseRepository {

  save(instance) {
    instance._type = this.modelType;
    return couchbaseWrapper.upsert(uuid(), instance);
  }


  getByServiceId(serviceId) {
    return couchbaseWrapper.query("SELECT * FROM hermet WHERE _type=$1 AND serviceId=$2", [this.modelType, serviceId]);
  }
}

module.exports = new StubsRepository("stub");