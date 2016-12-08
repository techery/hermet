'use strict';

let BaseRepository = require('./BaseRepository');
let couchbaseWrapper = require('../services/CouchbaseWrapper');
const uuid = require('uuid');

class StubsRepository extends BaseRepository {

  setServiceId(serviceId) {
    this.serviceId = serviceId;

    return this;
  }

  promisify(body) {
    return new Promise((resolve, reject) => {
      body((error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  all() {
    return this.promisify((callback) => {
      couchbaseWrapper.bucket.lookupIn(this.serviceId).get('stubs').execute(callback);
    }).then(function(item) {
      return item.contents[0].value;
    });
  }

  save(data) {
    var id = uuid();
    return new Promise((resolve, reject) => {
      couchbaseWrapper.bucket.mutateIn(this.serviceId).upsert('stubs.' + id, data, true).execute((error, result) => {
        if (error) {
          reject(error);
        }
        resolve(id, result);
      });
    });
  }

  getById(id) {
    return this.promisify((callback) => {
      couchbaseWrapper.bucket.lookupIn(this.serviceId).get('stubs.' + id).execute(callback);
    }).then(function(item) {
      return item.contents[0].value;
    });
  }

  remove(id) {
    return this.promisify((callback) => {
      couchbaseWrapper.bucket.mutateIn(this.serviceId).remove('stubs.' + id).execute(callback);
    });
  }

  update(id, data) {
    return this.promisify((callback) => {
      couchbaseWrapper.bucket.mutateIn(this.serviceId).upsert('stubs.' + id, data, false).execute(callback);
    });
  }

  removeAll() {
    return this.promisify((callback) => {
      couchbaseWrapper.bucket.mutateIn(this.serviceId).remove('stubs').execute(callback);
    });
  }
}

module.exports = new StubsRepository('stub');
