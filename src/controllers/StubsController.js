let stubsRepository = require('../repositories/StubsRepository');

const BASE_URL = "http://localhost:5000/api";

class StubsController {

  constructor(stubsRepository) {
    this.stubsRepository = stubsRepository;
  }

  create(req, res, next) {
    this.stubsRepository.setServiceId(req.params.serviceId)
      .save(req.body)
      .then((id) => {
        res.set('Location', BASE_URL + "/services/" + req.params.serviceId + "/stubs/" + id);
        res.status(201).end();
      }).catch(next);
  }

  get(req, res, next) {
    this.stubsRepository.setServiceId(req.params.serviceId)
      .getById(req.params.stubId)
      .then((stub) => {
        res.status(200).json(stub);
      }).catch(function (error) {
        res.status(404).json({"error": error.message});
    });
  }

  update(req, res, next) {
    this.stubsRepository.setServiceId(req.params.serviceId)
      .update(req.params.stubId, req.body)
      .then(() => {
        res.status(204).end();
      }).catch(next);
  }

  remove(req, res, next) {
    this.stubsRepository.setServiceId(req.params.serviceId)
      .remove(req.params.stubId)
      .then((stub) => {
        res.status(204).end();
      }).catch(next);
  }

  list(req, res, next) {
    this.stubsRepository.setServiceId(req.params.serviceId)
      .all()
      .then((items) => {
        res.status(200).json(items);
      }).catch(next);
  }

  removeAll(req, res, next) {
    this.stubsRepository.setServiceId(req.params.serviceId)
      .removeAll()
      .then((stub) => {
        res.status(204).end();
      }).catch(next);
  }
}

module.exports = new StubsController(stubsRepository);