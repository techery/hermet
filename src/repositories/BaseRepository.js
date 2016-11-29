let couchbaseWrapper = require('../services/CouchbaseWrapper');
class BaseRepository {

  constructor(modelType) {
    this.modelType = modelType;
  }
}

module.exports = BaseRepository;