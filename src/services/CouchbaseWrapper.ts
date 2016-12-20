import config from "../config";

var couchbase = require('couchbase');

class CouchbaseWrapper {
  /**
   * @param {string} host
   * @param {string} bucketName
   * @param {numeric} timeout
   */
  constructor(host, bucketName, timeout) {
    this.bucketName = bucketName;
    this.cluster = new couchbase.Cluster('couchbase://' + host);

    let bucket = this.cluster.openBucket(bucketName);

    bucket.operationTimeout = timeout;
    this.bucket = bucket;
  }

  /**
   * @param {*} body
   * @returns {Promise}
   */
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

  /**
   * @param {string} query
   * @param {Object} params
   * @returns {Promise}
   */
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

        return item;
      });

      return result;
    });
  }

  /**
   * @param {numeric} id
   * @returns {Promise}
   */
  get(id) {
    return this.promisify((callback) => {
      this.bucket.get(id, callback);
    }).then(item => {
      return item.value;
    });
  }

  /**
   * @param {numeric} id
   * @param {Object} data
   * @returns {Promise}
   */
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

  /**
   * @param {numeric} id
   * @param {Object} data
   * @returns {Promise}
   */
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

  /**
   * @param {numeric} id
   * @returns {Promise}
   */
  remove(id) {
    return this.promisify((callback) => {
      this.bucket.remove(id, callback);
    });
  }

  /**
   * @returns {Promise}
   */
  createPrimaryIndex() {
    let N1qlQuery = couchbase.N1qlQuery;

    return this.promisify((callback) => {
      let n1qlQuery = N1qlQuery.fromString('CREATE PRIMARY INDEX ON `' + this.bucketName + '` USING GSI');

      this.bucket.query(n1qlQuery, {}, callback);
    });
  }
}

module.exports = new CouchbaseWrapper(
  config.couchbase.host,
  config.couchbase.bucket,
  config.couchbase.operationTimeout
);
