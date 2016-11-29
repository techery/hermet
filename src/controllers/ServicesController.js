let serviceRepository = require('../repositories/ServiceRepository');

class ServicesController {

  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  list(req, res, next) {
    this.serviceRepository.all().then((items) => {
      res.status(200).json(items);
    }).catch(next);
  }

  create(req, res, next) {
    this.serviceRepository.save({
      name: "merchant-service-preprod",
      proxyHost:  "merchant-service-preprod.proxy.io:5050",
      targetUrl: "http://techery-dt-preprod.techery.io:3020",
      stubs: []
    }).then(() => {
      res.status(204).send("");
    }).catch(next);
  }
}

module.exports = new ServicesController(serviceRepository);