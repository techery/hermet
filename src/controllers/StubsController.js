'use strict';

let stubsRepository = require('../repositories/StubsRepository');
let BaseController = require('./BaseController');

class StubsController extends BaseController {

  constructor(stubsRepository) {
    super();
    this.stubsRepository = stubsRepository;
  }

  async create(req, res) {
    let result = await this.prepareStubRepositiory(req).create(req.body);
    this.respondWithCreated(res, '/services/' + req.params.serviceId + '/stubs/' + result._id)
  }

  async get(req, res) {
    try {
      let stub = await this.prepareStubRepositiory(req).get(req.params.stubId);
      this.respondJson(res, stub);
    } catch (err) {
      this.respondWithNotFound();
    }
  }

  async update(req, res) {
    await this.prepareStubRepositiory(req).update(req.params.stubId, req.body);
    this.respondWithNoContent(res)
  }

  async remove(req, res) {
    try {
      await this.prepareStubRepositiory(req).remove(req.params.stubId);
      this.respondWithNoContent(res);
    } catch (err) {
      this.respondWithNotFound();
    }
  }

  async list(req, res) {
    let items = await this.prepareStubRepositiory(req).all();
    this.respondJson(res, items);
  }

  async removeAll(req, res) {
    await this.prepareStubRepositiory(req).removeAll();
    this.respondWithNoContent(res)
  }

  prepareStubRepositiory(req) {
    return this.stubsRepository
      .setServiceId(req.params.serviceId)
      .setSessionId(req.sessionId);
  }
}

module.exports = new StubsController(stubsRepository);
