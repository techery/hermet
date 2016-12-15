'use strict';

let express = require('express');
let logger = require('./components/logger').apiLogger;
let bodyParser = require('body-parser');

let sessions = require('./middleware/sessions');
let index = require('./routes/index');
let routes = require('./routes/all');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessions);

app.use(index);
app.use('/api', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({error: 'Not Found'});
});

// error handler
app.use(function(err, req, res, next) {
  logger.error('Request: ' + logger.curlify(req, req.body || null) + '\r\n' +  err.stack);

  if (err.errorCode) {
    return res.status(err.statusCode || 500).json({error: err.errorCode + ' ' + err.name + ': ' + err.message});
  }

  res.status(500).json({error: 'Hermet API error.'});
});

module.exports = app;
