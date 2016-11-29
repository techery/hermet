let stubsRepository = require('../repositories/StubsRepository');

class StubsController {

  constructor(stubsRepository) {
    this.stubsRepository = stubsRepository;
  }

  list(req, res, next) {
    this.stubsRepository.find().then((items) => {
      res.status(200).json(items);
    }).catch(next);
  }

  create(req, res, next) {
    let stub = this.stubsRepository.create({
      response: "Ok",
      predicates:  "{equals: { field: 'value' }}"
    });

    this.stubsRepository.save(stub).then(() => {
      res.status(204).send("");
    }).catch(next);
  }
}

module.exports = new StubsController(stubsRepository);