let BaseRepository = require('./BaseRepository');
let elastic = require('../services/elastic');

class StubsRepository extends BaseRepository {
  /**
   * @param {Object} client
   * @param {string} modelType
   */
  constructor(client, modelType) {
    super(client, modelType);

    this.sessionId = 'default';
  }

  /**
   * @param {integer} serviceId
   * @returns {StubsRepository}
   */
  setServiceId(serviceId) {
    this.serviceId = serviceId;

    return this;
  }

  /**
   * @param {integer} sessionId
   * @returns {StubsRepository}
   */
  setSessionId(sessionId) {
    this.sessionId = sessionId;

    return this;
  }

  /**
   * @param {Object} data
   * @returns {Promise}
   */
  create(data) {
    data.sessionId = this.sessionId;

    return this.client.create(this.modelType, data, this.serviceId);
  }

  /**
   * @param {integer} id
   * @returns {Promise}
   */
  get(id) {
    return this.client.get(this.modelType, id, this.serviceId).then(response => {
      let result = response._source;

      result.id = response._id;

      return result;
    });
  }

  /**
   * @param {integer} id
   * @param {Object} data
   * @returns {Promise}
   */
  update(id, data) {
    data.sessionId = this.sessionId;

    return this.client.update(this.modelType, id, data, this.serviceId);
  }

  /**
   * @param {integer} id
   * @returns {Promise}
   */
  remove(id) {
    return this.client.remove(this.modelType, id, this.serviceId);
  }

  /**
   * @returns {Promise}
   */
  all() {
    return this.client.search(this.modelType, this.prepareSearchParams())
      .then(response => {
        let result = [];

        response.hits.hits.map((item) => {
          item._source.id = item._id;
          result.push(item._source);

          return item;
        });

        return result;
      });
  }

  /**
   * @returns {Promise}
   */
  removeAll() {
    return this.client.removeByQuery(this.modelType, this.prepareSearchParams());
  }

  /**
   * @returns {Object}
   */
  prepareSearchParams() {
    return {
      query: {
        bool: {
          filter: [
            {
              match: {
                sessionId: this.sessionId
              }
            },
            {
              parent_id: {
                type: this.modelType,
                id: this.serviceId
              }
            }
          ]
        }
      }
    };
  }
}

module.exports = new StubsRepository(elastic, 'stub');
