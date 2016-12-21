let express = require('express');
let router = new express.Router({mergeParams: true});
let services = require('./services');
let sessions = require('./sessions');

router.use('/services', services);
router.use('/sessions', sessions);

module.exports = router;
