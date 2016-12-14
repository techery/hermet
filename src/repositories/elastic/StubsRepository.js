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
    data.sessionId = this.sessionId;
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
    data.sessionId = this.sessionId;
    return this.client.update(this.modelType, id, data, this.serviceId);
  }

  remove(id) {
    return this.client.remove(this.modelType, id, this.serviceId);
  }

  all() {
    return this.client.search(this.modelType, this.prepareSearchParams())
      .then(response => {
        let result = [];
        response.hits.hits.map((item) => {
          item._source.id =item._id;
          result.push(item._source);
        });

        return result;
      });
  }

  removeAll() {
    return this.client.removeByQuery(this.modelType, this.prepareSearchParams());
  }

  prepareSearchParams() {
    return {
      "query": {
        "bool": {
          "filter": [
            {
              "match": {
                "sessionId": this.sessionId
              }
            },
            {
              "parent_id": {
                "type": this.modelType,
                "id": this.serviceId
              }
            }
          ]
        }
      }
    }
  }
}

module.exports = new StubsRepository(elastic, 'stub');
