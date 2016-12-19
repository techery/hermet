let BaseRepository = require('./BaseRepository');
let elastic = require('../services/elastic');

class ServiceRepository extends BaseRepository {
  /**
   * @param {Object} data
   * @returns {Promise}
   */
  create(data) {
    return this.client.create(this.modelType, data);
  }

  /**
   * @param {integer} id
   * @returns {Promise}
   */
  get(id) {
    return this.client.get(this.modelType, id).then(response => {
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
    return this.client.update(this.modelType, id, data);
  }

  /**
   * @param {integer} id
   * @returns {Promise}
   */
  remove(id) {
    return this.client.remove(this.modelType, id);
  }

  /**
   * @returns {Promise}
   */
  all() {
    return this.client.search(this.modelType)
      .then(response => {
        let result = [];

        response.hits.hits.map((item) => {
          result.push(item._source);

          return item;
        });

        return result;
      });
  }

  /**
   * @param {string} proxyHost
   * @returns {Promise}
   */
  getByProxyHost(proxyHost) {
    let options = {
      type: this.modelType,
      body: {
        'query': {
          'match': {'proxyHost': proxyHost}
        }
      }
    };

    return this.client.searchByOptions(options)
      .then(response => {

        if (response.hits.total === 0) {
          return null;
        }

        let item = response.hits.hits[0];
        let result = item._source;

        result.id = item._id;

        return result;
      });
  }
}

module.exports = new ServiceRepository(elastic, 'service');
