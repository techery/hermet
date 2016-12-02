var config = require('../config/config');
var couchbase = require('couchbase');
var ottoman = require('ottoman');

class CouchbaseWrapper {

  constructor(host, bucketName, timeout) {
    this.bucketName = bucketName;
    this.cluster = new couchbase.Cluster('couchbase://' + host);
    let bucket = this.cluster.openBucket(bucketName);
    bucket.operationTimeout = timeout;
    this.bucket = bucket;
    this.ottoman = ottoman;
    this.ottoman.bucket = bucket;
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

  query(query, params) {
    var N1qlQuery = couchbase.N1qlQuery;

    return this.promisify((callback) => {
      let n1qlQuery = N1qlQuery.fromString(query);
      n1qlQuery.consistency(N1qlQuery.Consistency.NOT_BOUNDED);
      this.bucket.query(n1qlQuery, params || {}, callback);
    }).then((items) => {
      let result = [];
      items.map((item) => {
        result.push(item[this.bucketName]);
      });

      return result;
    });
  }

  get(id) {
    return this.promisify((callback) => {
      this.bucket.get(id, callback);
    }).then(item => {
      return item.value;
    });
  }

  upsert(id, data) {
    return new Promise((resolve, reject) => {
      this.bucket.upsert(id, data, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(id, result);
      });
    });
  }

  insert(id, data) {
    return new Promise((resolve, reject) => {
      this.bucket.insert(id, data, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(id, result);
      });
    });
  }

  remove(id) {
    return this.promisify((callback) => {
      this.bucket.remove(id, callback);
    });
  }
}

module.exports = new CouchbaseWrapper(config.couchbase.host, config.couchbase.bucket, config.couchbase.operationTimeout);