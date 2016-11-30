let express = require('express');
let router = express.Router({mergeParams: true});
let stubs = require('./stubs');
let servicesController = require('../controllers/ServicesController');


router.route('/')
  .get((req, res, next) => servicesController.list(req, res, next))
  .post((req, res, next) => servicesController.create(req, res, next));

router.route('/:serviceId')
  .get((req, res, next) => servicesController.get(req, res, next))
  .put((req, res, next) => servicesController.update(req, res, next))
  .delete((req, res, next) => servicesController.remove(req, res, next));

router.use('/', stubs);

module.exports = router;