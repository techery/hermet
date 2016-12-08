'use strict';

let express = require('express');
let router = express.Router();
let stubController = require('../controllers/StubsController');

router.route('/:serviceId/stubs')
  .get((req, res, next) => stubController.list(req, res, next))
  .post((req, res, next) => stubController.create(req, res, next))
  .delete((req, res, next) => stubController.removeAll(req, res, next));

router.route('/:serviceId/stubs/:stubId')
  .get((req, res, next) => stubController.get(req, res, next))
  .put((req, res, next) => stubController.update(req, res, next))
  .delete((req, res, next) => stubController.remove(req, res, next));

module.exports = router;
