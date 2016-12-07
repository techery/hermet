'use strict';

let couchbaseWrapper = require('../services/CouchbaseWrapper');
const md5 = require('md5');

let BaseRepository = require('./BaseRepository');

class ServiceRepository extends BaseRepository {

  save(instance) {
    instance._id = md5(instance.proxyHost);
    instance._type = this.modelType;
    return couchbaseWrapper.insert(instance._id, instance);
  }

  all() {
    return couchbaseWrapper.query('SELECT * FROM ' + couchbaseWrapper.bucketName + ' WHERE _type=$1', [this.modelType]);
  //  return couchbaseWrapper.query('CREATE PRIMARY INDEX ON `hernet` USING GSI');
  }

  getByProxyHost(proxyHost) {
    return couchbaseWrapper.get(md5(proxyHost));
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

module.exports = new ServiceRepository('service');
