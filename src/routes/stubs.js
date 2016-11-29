let express = require('express');
let router = express.Router();
let stubController = require('../controllers/StubsController');

router.route('/:serviceId/stubs')
  .get((req, res, next) => stubController.list(req, res, next))
  .post((req, res, next) => stubController.create(req, res, next))
  .delete((req, res, next) => {
    res.send("Delete rule");
  });

router.route('/:serviceId/stubs/:stubId')
  .get((req, res, next) => {
    res.send("Get stub details");
  })
  .put((req, res, next) => {
    res.send("Update stub");
  })
  .delete((req, res, next) => {
    res.send("Delete stub");
  });

module.exports = router;
