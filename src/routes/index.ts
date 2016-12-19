let express = require('express');
let router = new express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.send('Techery proxy service');
});

module.exports = router;
