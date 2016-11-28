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
}

module.exports = new CouchbaseWrapper(config.couchbase.host, config.couchbase.bucket, config.couchbase.operationTimeout);