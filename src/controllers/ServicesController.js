let serviceRepository = require('../repositories/ServiceRepository');

class ServicesController {

  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  list(req, res, next) {
    this.serviceRepository.find().then((items) => {
      res.status(200).json(items);
    }).catch(next);
  }

  create(req, res, next) {
    let rule = this.serviceRepository.create({
      name: "merchant-service-preprod",
      proxyHost:  "merchant-service-preprod.proxy.io:5050",
      targetUrl: "http://techery-dt-preprod.techery.io:3020"
    });

    this.serviceRepository.save(rule).then(() => {
      res.status(204).send("");
    }).catch(next);
  }
}

module.exports = new ServicesController(serviceRepository);