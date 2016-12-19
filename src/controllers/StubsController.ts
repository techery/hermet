let stubsRepository = require('../repositories/StubsRepository');
let BaseController = require('./BaseController');

class StubsController extends BaseController {

  /**
   * @param {Object} stubsRepository
   */
  constructor(stubsRepository) {
    super();
    this.stubsRepository = stubsRepository;
  }

  /**
   * Create new stub
   *
   * @param {Object} req
   * @param {Object} res
   */
  async create(req, res) {
    let result = await this.prepareStubRepositiory(req).create(req.body);

    this.respondWithCreated(res, '/services/' + req.params.serviceId + '/stubs/' + result._id);
  }

  /**
   * Get stub
   *
   * @param {Object} req
   * @param {Object} res
   */
  async get(req, res) {
    try {
      let stub = await this.prepareStubRepositiory(req).get(req.params.stubId);

      this.respondJson(res, stub);
    } catch (err) {
      this.respondWithNotFound();
    }
  }

  /**
   * Update stub details
   *
   * @param {Object} req
   * @param {Object} res
   */
  async update(req, res) {
    await this.prepareStubRepositiory(req).update(req.params.stubId, req.body);
    this.respondWithNoContent(res);
  }

  /**
   * Remove stub
   *
   * @param {Object} req
   * @param {Object} res
   */
  async remove(req, res) {
    try {
      await this.prepareStubRepositiory(req).remove(req.params.stubId);
      this.respondWithNoContent(res);
    } catch (err) {
      this.respondWithNotFound();
    }
  }

  /**
   * Get all stubs
   *
   * @param {Object} req
   * @param {Object} res
   */
  async list(req, res) {
    let items = await this.prepareStubRepositiory(req).all();

    this.respondJson(res, items);
  }

  /**
   * Remove all stubs
   *
   * @param {Object} req
   * @param {Object} res
   */
  async removeAll(req, res) {
    await this.prepareStubRepositiory(req).removeAll();
    this.respondWithNoContent(res);
  }

  /**
   * @param {Object} req
   * @returns {Object}
   */
  prepareStubRepositiory(req) {
    return this.stubsRepository
      .setServiceId(req.params.serviceId)
      .setSessionId(req.sessionId);
  }
}

module.exports = new StubsController(stubsRepository);
