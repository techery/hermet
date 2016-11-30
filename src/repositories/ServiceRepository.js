let couchbaseWrapper = require('../services/CouchbaseWrapper');
const uuid = require('uuid');

let BaseRepository = require('./BaseRepository');

class ServiceRepository extends BaseRepository {

  save(instance) {
    instance._id = uuid();
    instance._type = this.modelType;
    return couchbaseWrapper.upsert(instance._id, instance);
  }

  all() {
    return couchbaseWrapper.query("SELECT * FROM " + couchbaseWrapper.bucketName + " WHERE _type=$1", [this.modelType]);
  //  return couchbaseWrapper.query("CREATE PRIMARY INDEX ON `hernet` USING GSI");
  }

  getByProxyHost(proxyHost) {
    return couchbaseWrapper.query(
      "SELECT * FROM " + couchbaseWrapper.bucketName + " WHERE _type=$1 AND proxyHost=$2",
      [this.modelType, proxyHost]
    );
  }
  get(id) {
    return couchbaseWrapper.get(id);
  }

  update(id, data) {
    return couchbaseWrapper.upsert(id, data);
  }

  remove(id) {
    return couchbaseWrapper.remove(id);
  }
}

module.exports = new ServiceRepository("service");
