let BaseRepository = require('../BaseRepository');
let elastic = require('../../services/elastic');

class ServiceRepository extends BaseRepository {

  create(data) {
    return this.client.create(this.modelType, data);
  }

  get(id) {
    return this.client.get(this.modelType, id).then(response => {
      let result = response._source;
      result.id = response._id;

      return result;
    });
  }

  update(id, data) {
    return this.client.update(this.modelType, id, data);
  }

  remove(id) {
    return this.client.remove(this.modelType, id);
  }

  all() {
    return this.client.search(this.modelType)
      .then(response => {
        let result = [];
        response.hits.hits.map((item) => {
          result.push(item._source);
        });

        return result;
      });
  }

  getByProxyHost(proxyHost) {
   // ToDo define
  }
}

module.exports = new ServiceRepository(elastic, 'service');
