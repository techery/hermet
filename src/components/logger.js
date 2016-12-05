"use strict";

const config = require("../config");
let winston = require('winston'),
    path = require('path');
require('winston-daily-rotate-file');

function initLogger() {
  let transport = new winston.transports.DailyRotateFile({
    filename: path.join("log/", config.log.fileName),
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
    this.loggerInstance.log("info", message, data);
  }

  debug(message, data) {
    this.loggerInstance.log("debug", message, data);
  }

  error(message, data) {
    this.loggerInstance.log("error", message, data);
  }
}

module.exports = new Logger(initLogger());
