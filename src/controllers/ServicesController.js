let serviceRepository = require('../repositories/ServiceRepository');

class ServicesController {

  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }
  list(req, res) {
    this.serviceRepository.find().then((items) => {
      res.status(200).json(items);
    }).catch(err =>
      res.status(400).json({errors: {base: err.message}})
    );
  }

  create(req, res) {
    let rule = this.serviceRepository.create({
      name: "merchant-service-preprod",
      proxyHost:  "merchant-service-preprod.proxy.io:5050",
      targetUrl: "http://techery-dt-preprod.techery.io:3020"
    });

    this.serviceRepository.save(rule).then(() => {
      res.status(204).send("");
    }).catch(err =>
      res.status(400).json({errors: {base: err.message}})
    );
  }
}

module.exports = new ServicesController(serviceRepository);