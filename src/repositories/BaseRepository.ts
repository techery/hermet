class BaseRepository {

  /**
   * @param {Object} client
   * @param {string} modelType
   */
  constructor(client, modelType) {
    this.client = client;
    this.modelType = modelType;
  }
}

module.exports = BaseRepository;
