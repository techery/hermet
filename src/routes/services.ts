import wrap from './wrapper';
import {servicesController} from '../container';

let express = require('express');
let router = new express.Router({mergeParams: true});
let stubs = require('./stubs');

router.route('/')
  .get(wrap(async (req, res, next) => servicesController.list(req, res)))
  .post(wrap(async (req, res, next) => servicesController.create(req, res)));

router.route('/:serviceId')
  .get(wrap(async (req, res, next) => servicesController.get(req, res)))
  .put(wrap(async (req, res, next) => servicesController.update(req, res)))
  .delete(wrap(async (req, res, next) => servicesController.remove(req, res)));

router.use('/', stubs);

module.exports = router;
