let ProxyRule = require('../models/proxyRule');

class ServiceRepository {

  constructor(modelType) {
    this.modelType = modelType;
  }

  create(params) {
    return new this.modelType(params);
  }

  save(instance) {
    return new Promise((resolve, reject) => {
      instance.save((error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  find(filters, options) {
    return new Promise((resolve, reject) => {
      this.modelType.find(filters || {}, options || {}, function(error, items) {
        if (error) {
          reject(error);
        }
        resolve(items);
      });
    });
  }
}

module.exports = new ServiceRepository(ProxyRule);