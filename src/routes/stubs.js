let express = require('express');
let router = express.Router();

router.route('/')
  .get((req, res, next) => {
    res.send("Stub list");
  })
  .post((req, res, next) => {
    res.send("Create new stub");
  })
  .delete((req, res, next) => {
    res.send("Delete rule");
  });

router.route('/:stubId')
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
