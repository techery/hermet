'use strict';

class BaseRepository {

  constructor(client, modelType) {
    this.client = client;
    this.modelType = modelType;
  }
}

module.exports = BaseRepository;
