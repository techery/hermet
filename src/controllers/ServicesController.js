let serviceRepository = require('../repositories/ServiceRepository');

const BASE_URL = "http://localhost:5000/api";

class ServicesController {

  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  create(req, res, next) {
    this.serviceRepository.save(req.body)
    .then((id) => {
      res.set('Location', BASE_URL + "/services/" + id);
      res.status(201).end();
    })
    .catch(next);
  }

  get(req, res, next) {
    this.serviceRepository.get(req.params.serviceId)
    .then((item) => {
      res.status(200).send(item);
    }).catch(function (error) {
      res.status(404).json({"error": error.message});
    });
  }

  update(req, res, next) {
    this.serviceRepository.update(req.params.serviceId, req.body)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  }

  remove(req, res, next) {
    this.serviceRepository.remove(req.params.serviceId)
      .then((item) => {
        res.status(204).end();
      })
      .catch(next);
  }

  list(req, res, next) {
    this.serviceRepository.all().then((items) => {
      res.status(200).json(items);
    }).catch(next);
  }
}

module.exports = new ServicesController(serviceRepository);