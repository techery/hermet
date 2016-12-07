'use strict';

const config = require('../config');
let curlify = require('request-as-curl'),
    winston = require('winston'),
    path = require('path');
require('winston-daily-rotate-file');

function initLogger(logFileName) {
  let transport = new winston.transports.DailyRotateFile({
    filename: path.join('log/', logFileName),
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    json: false,
    level: config.log.logLevel
  });

  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      transport
    ]
  })
}

class Logger {
  constructor(loggerInstance) {
    this.loggerInstance = loggerInstance;
  }

  info(message, data) {
    this.loggerInstance.log('info', message, data);
  }

  debug(message, data) {
    this.loggerInstance.log('debug', message, data);
  }

  error(message, data) {
    this.loggerInstance.log('error', message, data);
  }

  curlify(req, data) {
    return curlify(req, data);
  }
}

module.exports = {
  apiLogger: new Logger(initLogger(config.log.apiFileName)),
  proxyLogger: new Logger(initLogger(config.log.proxyFileName))
};
