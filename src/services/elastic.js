'use strict';

let elasticsearch = require('elasticsearch');

function _initClient() {
  return new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });
}

class ElasticWrapper {
  constructor(client, index) {
    this.client = client;
    this.index = index;
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

  get(type, id, parentId) {

    let options = {index: this.index, type: type, id: id};
    if (parentId) {
      options.parent = parentId;
    }
    console.log(options);
    return this.promisify((callback) => {
      this.client.get(options, callback);
    });
  }

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

  remove(type, id, parentId) {
    let options = {index: this.index, type: type, id: id};
    if (parentId) {
      options.parent = parentId;
    }

    return this.promisify((callback) => {
      this.client.delete(options, callback);
    });
  }

  search(type, body) {
    let options = {index: this.index, type: type};
    if (body) {
      options.body = body;
    }

    return this.promisify((callback) => {
      this.client.search(options, callback);
    });
  }

  searchByOptions(options) {
    options.index = this.index;

    return this.promisify((callback) => {
      this.client.search(options, callback);
    });
  }
}

module.exports = new ElasticWrapper(_initClient(), "hermet");
