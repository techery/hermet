'use strict';

let BaseRepository = require('../BaseRepository');
let elastic = require('../../services/elastic');

class StubsRepository extends BaseRepository {

  constructor(client, modelType) {
    super(client, modelType);

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

  create(data) {
    return this.client.create(this.modelType, data, this.serviceId);
  }

  get(id) {
    return this.client.get(this.modelType, id, this.serviceId).then(response => {
      let result = response._source;
      result.id = response._id;

      return result;
    });
  }

  update(id, data) {
    return this.client.update(this.modelType, id, data, this.serviceId);
  }

  remove(id) {
    return this.client.remove(this.modelType, id, this.serviceId);
  }

  all() {
    let body = {
      "query": {
        "term": {
          "_parent": this.serviceId
        }
      }
    };

    return this.client.search(this.modelType, body)
      .then(response => {
        let result = [];
        response.hits.hits.map((item) => {
          result.push(item._source);
        });

        return result;
      });
  }

  removeAll() {
    // ToDo define
  }
}

module.exports = new StubsRepository(elastic, 'stub');
