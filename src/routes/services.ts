let express = require('express');
let router = new express.Router({mergeParams: true});
let stubs = require('./stubs');
let servicesController = require('../controllers/ServicesController');
let wrap = require('./wrapper');

router.route('/')
  .get(wrap(async (req, res, next) => servicesController.list(req, res, next)))
  .post(wrap(async (req, res, next) => servicesController.create(req, res, next)));

router.route('/:serviceId')
  .get(wrap(async (req, res, next) => servicesController.get(req, res, next)))
  .put(wrap(async (req, res, next) => servicesController.update(req, res, next)))
  .delete(wrap(async (req, res, next) => servicesController.remove(req, res, next)));

router.use('/', stubs);

module.exports = router;
