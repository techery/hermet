'use strict';

let stubsRepository = require('../repositories/StubsRepository');
let config = require('../config');

class StubsController {

  constructor(stubsRepository) {
    this.stubsRepository = stubsRepository;
  }

  create(req, res, next) {
    this.prepareStubRepositiory(req)
      .save(req.body)
      .then((id) => {
        res.set('Location', config.app.hermet_api_base_url + '/services/' + req.params.serviceId + '/stubs/' + id);
        res.status(201).end();
      })
      .catch(next);
  }

  get(req, res, next) {
    this.prepareStubRepositiory(req)
      .getById(req.params.stubId)
      .then((stub) => {
        res.status(200).json(stub);
      })
      .catch(function (error) {
        res.status(404).json({'error': error.message});
    });
  }

  update(req, res, next) {
    this.prepareStubRepositiory(req)
      .update(req.params.stubId, req.body)
      .then(() => {
        res.status(204).end();
      }).catch(next);
  }

  remove(req, res, next) {
    this.prepareStubRepositiory(req)
      .remove(req.params.stubId)
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => {
        res.status(404).json({'error': error.message});
      });
  }

  list(req, res, next) {
    this.prepareStubRepositiory(req)
      .all()
      .then((items) => {
        res.status(200).json(items);
      })
      .catch(next);
  }

  removeAll(req, res, next) {
    this.prepareStubRepositiory(req)
      .removeAll()
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  }

  prepareStubRepositiory(req) {
    return this.stubsRepository
      .setServiceId(req.params.serviceId)
      .setSessionId(req.sessionId);
  }
}

module.exports = new StubsController(stubsRepository);
