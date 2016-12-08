'use strict';

let express = require('express');
let logger = require('./components/logger').apiLogger;
let bodyParser = require('body-parser');

let index = require('./routes/index');
let all = require('./routes/all');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(index);
app.use('/api', all);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  logger.error(err.message +
    '\r\nRequest: ' + logger.curlify(req, req.body || null) +
    '\r\n' +  err.stack
  );

  res.status(500).json({error: 'Hermet API error.'});
});

module.exports = app;
