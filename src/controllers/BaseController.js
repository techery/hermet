'use strict';

let config = require('../config');
let NotFound = require('./errors/NotFound');
let logger = require('../components/logger').apiLogger;

class BaseController {

  constructor() {}

  respondJson(res, json) {
    res.status(200).json(json);
  }

  respondWithCreated(res, uri) {
    res.set('Location', config.app.hermet_api_base_url + uri);
    res.status(201).end();
  }

  respondWithNoContent(res) {
    res.status(204).end();
  }

  respondWithNotFound(message, errorCode) {
    throw new NotFound(message, errorCode);
  }
}

module.exports = BaseController;