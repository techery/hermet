var config = require('../config/config');
var couchbase = require('couchbase');
var ottoman = require('ottoman');

class CouchbaseWrapper {

  constructor(host, bucketName, timeout) {
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
      this.bucket.query(N1qlQuery.fromString(query), params || {}, callback);
    });
  }

  upsert(id, data) {
    return this.promisify((callback) => {
      this.bucket.upsert(id, data, callback);
    });
  }
}

module.exports = new CouchbaseWrapper(config.couchbase.host, config.couchbase.bucket, config.couchbase.operationTimeout);