import config from "../config";

let elasticsearch = require('elasticsearch');

/**
 * @returns {Object}
 * @private
 */
function _initClient() {
  return new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });
}

class ElasticWrapper {
  /**
   * @param {Object} client
   * @param {string} index
   */
  constructor(client, index) {
    this.client = client;
    this.index = index;
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
   * @param {string} type
   * @param {Object} data
   * @param {numeric} parentId
   * @returns {Promise}
   */
  create(type, data, parentId) {
    return this.promisify((callback) => {
      let options = {index: this.index, type: type, body: data};

      if (parentId) {
        options.parent = parentId;
      }
      options.refresh = true;

      this.client.index(options, callback);
    });
  }

  /**
   * @param {string} type
   * @param {numeric} id
   * @param {numeric} parentId
   * @returns {Promise}
   */
  get(type, id, parentId) {
    let options = {index: this.index, type: type, id: id};

    if (parentId) {
      options.parent = parentId;
    }

    return this.promisify((callback) => {
      this.client.get(options, callback);
    });
  }

  /**
   * @param {string} type
   * @param {numeric} id
   * @param {Object} data
   * @param {numeric} parentId
   * @returns {Promise}
   */
  update(type, id, data, parentId) {
    let options = {
      index: this.index,
      type: type,
      id: id,
      refresh: true,
      body: {
        doc: data
      }
    };

    if (parentId) {
      options.parent = parentId;
    }

    return this.promisify((callback) => {
      this.client.update(options, callback);
    });
  }

  /**
   * @param {string} type
   * @param {numeric} id
   * @param {numeric} parentId
   * @returns {Promise}
   */
  remove(type, id, parentId) {
    let options = {index: this.index, type: type, id: id};

    if (parentId) {
      options.parent = parentId;
    }

    return this.promisify((callback) => {
      this.client.delete(options, callback);
    });
  }

  /**
   * @param {string} type
   * @param {*} body
   * @returns {Promise}
   */
  search(type, body) {
    let options = {index: this.index, type: type};

    if (body) {
      options.body = body;
    }

    return this.promisify((callback) => {
      this.client.search(options, callback);
    });
  }

  /**
   * @param {Object} options
   * @returns {Promise}
   */
  searchByOptions(options) {
    options.index = this.index;

    return this.promisify((callback) => {
      this.client.search(options, callback);
    });
  }

  /**
   * @param {string} type
   * @param {*} queryBody
   * @returns {Promise}
   */
  removeByQuery(type, queryBody) {
    let options = {
      index: this.index,
      type: type,
      conflicts: 'proceed'
    };

    if (queryBody) {
      options.body = queryBody;
    }

    return this.promisify((callback) => {
      this.client.deleteByQuery(options, callback);
    });
  }
}

module.exports = new ElasticWrapper(_initClient(), config.elasticsearch.index);
