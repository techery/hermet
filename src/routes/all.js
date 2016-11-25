let express = require('express');
let router = express.Router({mergeParams: true});

let index = require('./index');
let services = require('./services');

router.use(index);
router.use('/services', services);

module.exports = router;