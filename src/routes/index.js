'use strict';

let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Techery proxy service');
});

module.exports = router;
