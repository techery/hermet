let express = require('express');
let router = express.Router({mergeParams: true});

let services = require('./services');

router.use('/services', services);

module.exports = router;
