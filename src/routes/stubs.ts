import StubsController from '../controllers/StubsController';
import wrap from './wrapper';

let express = require('express');
let router = new express.Router();
let stubsRepository = require('../repositories/StubsRepository');
let stubController = new StubsController(stubsRepository);

router.route('/:serviceId/stubs')
  .get(wrap(async (req, res, next) => stubController.list(req, res)))
  .post(wrap(async (req, res, next) => stubController.create(req, res)))
  .delete(wrap(async (req, res, next) => stubController.removeAll(req, res)));

router.route('/:serviceId/stubs/:stubId')
  .get(wrap(async (req, res, next) => stubController.get(req, res)))
  .put(wrap(async (req, res, next) => stubController.update(req, res)))
  .delete(wrap(async (req, res, next) => stubController.remove(req, res)));

module.exports = router;
