let express = require('express');
let router = express.Router({mergeParams: true});

let stubs = require('./stubs');

router.route('/')
  .get((req, res, next) => {
    res.send("Proxy rule list");
  })
  .post((req, res, next) => {
    res.send("Create new rule");
  });

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