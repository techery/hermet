const config = require('../config');
let curlify = require('request-as-curl');
let path = require('path');
let winston = require('winston');

require('winston-daily-rotate-file');

/**
 * Setup logger
 *
 * @param {string} logFileName
 * @returns {winston.Logger}
 */
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
  });
}

class Logger {
  /**
   * @param {winston.Logger} loggerInstance
   */
  constructor(loggerInstance) {
    this.loggerInstance = loggerInstance;
  }

  /**
   * Log info message
   *
   * @param {string} message
   * @param {*} data
   */
  info(message, data) {
    this.loggerInstance.log('info', message, data);
  }

  /**
   * Log debug message
   *
   * @param {string} message
   * @param {*} data
   */
  debug(message, data) {
    this.loggerInstance.log('debug', message, data);
  }

  /**
   * Log error message
   *
   * @param {string} message
   * @param {*} data
   */
  error(message, data) {
    this.loggerInstance.log('error', message, data);
  }

  /**
   * @param {Object} req
   * @param {*} data
   * @returns {*}
   */
  curlify(req, data) {
    return curlify(req, data);
  }
}

module.exports = {
  apiLogger: new Logger(initLogger(config.log.apiFileName)),
  proxyLogger: new Logger(initLogger(config.log.proxyFileName))
};
