let stubsRepository = require('../repositories/StubsRepository');

class StubsController {

  constructor(stubsRepository) {
    this.stubsRepository = stubsRepository;
  }

  list(req, res, next) {
    this.stubsRepository.getByServiceId(req.params.serviceId).then((items) => {
      res.status(200).json(items);
    }).catch(next);
  }

  create(req, res, next) {
    this.stubsRepository.save({
      response: "Ok",
      predicates:  {equals: { field: 'value' }},
      serviceId: req.params.serviceId
    }).then(() => {
      res.status(204).send("");
    }).catch(next);
  }
}

module.exports = new StubsController(stubsRepository);