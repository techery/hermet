import ServicesController from '../controllers/ServicesController';
import wrap from './wrapper';

let express = require('express');
let router = new express.Router({mergeParams: true});
let stubs = require('./stubs');
let serviceRepository = require('../repositories/ServiceRepository');
let servicesController = new ServicesController(serviceRepository);

router.route('/')
  .get(wrap(async (req, res, next) => servicesController.list(req, res)))
  .post(wrap(async (req, res, next) => servicesController.create(req, res)));

router.route('/:serviceId')
  .get(wrap(async (req, res, next) => servicesController.get(req, res)))
  .put(wrap(async (req, res, next) => servicesController.update(req, res)))
  .delete(wrap(async (req, res, next) => servicesController.remove(req, res)));

router.use('/', stubs);

module.exports = router;
