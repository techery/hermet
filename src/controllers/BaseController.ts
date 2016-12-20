import config from "../config";

let NotFound = require('./errors/NotFound');

class BaseController {
  /**
   * Return json response
   *
   * @param {Object} res
   * @param {*} json
   */
  respondJson(res, json) {
    res.status(200).json(json);
  }

  /**
   * Return 201 Created response
   *
   * @param {Object} res
   * @param {string} uri
   */
  respondWithCreated(res, uri) {
    res.set('Location', config.app.hermet_api_base_url + uri);
    res.status(201).end();
  }

  /**
   * Return 204 No Content response
   *
   * @param {Object} res
   */
  respondWithNoContent(res) {
    res.status(204).end();
  }

  /**
   * Return 404 not found response (throw NotFound error)
   *
   * @param {string} message
   * @param {numeric} errorCode
   *
   * @throws NotFound
   */
  respondWithNotFound(message, errorCode) {
    throw new NotFound(message, errorCode);
  }
}

module.exports = BaseController;
