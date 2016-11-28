let express = require('express');
let router = express.Router({mergeParams: true});
let stubs = require('./stubs');
let servicesController = require('../controllers/ServicesController');


router.route('/')
  .get((req, res, next) => servicesController.list(req, res))
  .post((req, res, next) => servicesController.create(req, res));

router.route('/:serviceId')
  .get((req, res, next) => {
    res.send("Get rule details");
  })
  .put((req, res, next) => {
    res.send("Update rule");
  })
  .delete((req, res, next) => {
    res.send("Delete rule");
  });

router.use('/:serviceId/stubs', stubs);

module.exports = router;