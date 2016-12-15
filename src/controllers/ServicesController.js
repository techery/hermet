'use strict';

let serviceRepository = require('../repositories/ServiceRepository');
let BaseController = require('./BaseController');

class ServicesController extends BaseController {

  constructor(serviceRepository) {
    super();
    this.serviceRepository = serviceRepository;
  }

  async create(req, res) {
    let result = await this.serviceRepository.create(req.body);
    this.respondWithCreated(res,'/services/' + result._id);
  }

  async get(req, res) {
    try {
      let item = await this.serviceRepository.get(req.params.serviceId);
      this.respondJson(res, item);
    } catch (err) {
      this.respondWithNotFound();
    }
  }

  async update(req, res) {
    await this.serviceRepository.update(req.params.serviceId, req.body);
    this.respondWithNoContent(res);
  }

  async remove(req, res) {
    try {
      await this.serviceRepository.remove(req.params.serviceId);
      this.respondWithNoContent(res);
    } catch (err) {
      this.respondWithNotFound();
    }
  }

  async list(req, res) {
    let items = await this.serviceRepository.all();
    this.respondJson(res, items);
  }
}

module.exports = new ServicesController(serviceRepository);
