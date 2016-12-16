let serviceRepository = require('../repositories/ServiceRepository');
let BaseController = require('./BaseController');

class ServicesController extends BaseController {

  /**
   * @param {serviceRepository} serviceRepository
   */
  constructor(serviceRepository) {
    super();
    this.serviceRepository = serviceRepository;
  }

  /**
   * Create new service
   *
   * @param {Object} req
   * @param {Object} res
   */
  async create(req, res) {
    let result = await this.serviceRepository.create(req.body);

    this.respondWithCreated(res, '/services/' + result._id);
  }

  /**
   * Get service
   *
   * @param {Object} req
   * @param {Object} res
   */
  async get(req, res) {
    try {
      let item = await this.serviceRepository.get(req.params.serviceId);

      this.respondJson(res, item);
    } catch (err) {
      this.respondWithNotFound();
    }
  }

  /**
   * Update service parameters
   *
   * @param {Object} req
   * @param {Object} res
   */
  async update(req, res) {
    await this.serviceRepository.update(req.params.serviceId, req.body);
    this.respondWithNoContent(res);
  }

  /**
   * Delete the service
   *
   * @param {Object} req
   * @param {Object} res
   */
  async remove(req, res) {
    try {
      await this.serviceRepository.remove(req.params.serviceId);
      this.respondWithNoContent(res);
    } catch (err) {
      this.respondWithNotFound();
    }
  }

  /**
   * Get services list
   *
   * @param {Object} req
   * @param {Object} res
   */
  async list(req, res) {
    let items = await this.serviceRepository.all();

    this.respondJson(res, items);
  }
}

module.exports = new ServicesController(serviceRepository);
