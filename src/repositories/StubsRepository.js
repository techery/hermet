'use strict';

let BaseRepository = require('./BaseRepository');
let couchbaseWrapper = require('../services/CouchbaseWrapper');
const uuid = require('uuid');

class StubsRepository extends BaseRepository {

  constructor(modelType) {
    super(modelType);

    this.sessionId = 'default';
  }

  setServiceId(serviceId) {
    this.serviceId = serviceId;

    return this;
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;

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
      couchbaseWrapper.bucket.lookupIn(this.serviceId).get(this.getStubPath()).execute(callback);
    }).then(function(item) {
      return item.contents[0].value;
    });
  }

  save(data) {
    var id = uuid();
    return new Promise((resolve, reject) => {
      couchbaseWrapper.bucket.mutateIn(this.serviceId).insert(this.getStubPath(id), data, true).execute((error, result) => {
        if (error) {
          reject(error);
        }
        resolve(id, result);
      });
    });
  }

  getById(id) {
    return this.promisify((callback) => {
      couchbaseWrapper.bucket.lookupIn(this.serviceId).get(this.getStubPath(id)).execute(callback);
    }).then(function(item) {
      return item.contents[0].value;
    });
  }

  remove(id) {
    return this.promisify((callback) => {
      couchbaseWrapper.bucket.mutateIn(this.serviceId).remove(this.getStubPath(id)).execute(callback);
    });
  }

  update(id, data) {
    return this.promisify((callback) => {
      couchbaseWrapper.bucket.mutateIn(this.serviceId).upsert(this.getStubPath(id), data, true).execute(callback);
    });
  }

  removeAll() {
    return this.promisify((callback) => {
      couchbaseWrapper.bucket.mutateIn(this.serviceId).remove(this.getStubPath()).execute(callback);
    });
  }

  getStubPath(stubId) {
    let stubIdPath = stubId ? '.' + stubId : '';

    return 'sessions.' + this.sessionId + '.stubs' + stubIdPath
  }
}

module.exports = new StubsRepository('stub');
