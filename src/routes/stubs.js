'use strict';

let express = require('express');
let router = express.Router();
let stubController = require('../controllers/StubsController');
let wrap = require('./wrapper');

router.route('/:serviceId/stubs')
  .get(wrap(async (req, res, next) => stubController.list(req, res, next)))
  .post(wrap(async (req, res, next) => stubController.create(req, res, next)))
  .delete(wrap(async (req, res, next) => stubController.removeAll(req, res, next)));

router.route('/:serviceId/stubs/:stubId')
  .get(wrap(async (req, res, next) => stubController.get(req, res, next)))
  .put(wrap(async (req, res, next) => stubController.update(req, res, next)))
  .delete(wrap(async (req, res, next) => stubController.remove(req, res, next)));

module.exports = router;
