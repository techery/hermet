import config from './config';
import {serviceRepository, stubsRepository} from './container';

let httpProxy = require('http-proxy');
let logger = require('./components/logger').proxyLogger;
let stubResolver = require('./proxy/stubResolver');

//
// Create a proxy server with custom application logic
//
let proxy = httpProxy.createProxy({});

/**
 * @param {Object} res
 * @param {integer} status
 * @param {*} message
 */
function showError(res, status, message) {
  res.writeHead(status, {
    'Content-Type': 'text/plain'
  });
  res.end(message);
}

/**
 * @param {Object} err
 * @param {Object} req
 * @param {Object} res
 */
function showInternalError(err, req, res) {
  logger.error(err.message +
    '\r\nRequest: ' + logger.curlify(req, req.body || null) +
    '\r\n' + err.stack
  );
  showError(res, 500, 'Proxy error');
}

/**
 * @param {Object} stubs
 * @param {Object} req
 * @param {Object} res
 * @returns {boolean}
 */
function isStubsApplied(stubs, req, res) {

  let stub = stubResolver.resolveStubByRequest(stubs, req);

  if (stub) {
    let statusCode = stub.response.statusCode || 200;
    let headers = stub.response.headers || {};
    let body = stub.response.body || '';

    res.writeHead(statusCode, headers);
    res.end(body ? JSON.stringify(body) : body);

    return true;
  }

  return false;
}

proxy.on('error', function (err, req, res) {
  showInternalError(err, req, res);
});

module.exports = async (req, res) => {
  let service;

  try {
    service = await serviceRepository.getByProxyHost(req.headers.host);
    if (!service) {
      throw new Error('There is no proxy rules for this host:' + req.headers.host);
    }
  } catch (error) {
    let message = 'Can not get proxy rules for host: ' + req.headers.host;

    logger.error(message + ' Error: ' + error.message);

    return showError(res, 400, message);
  }

  try {
    let sessionId = req.headers[config.app.hermet_session_header] || 'default';
    let stubs = await stubsRepository
      .setServiceId(service.id)
      .setSessionId(sessionId)
      .all();

    if (isStubsApplied(stubs, req, res)) {
      return;
    }

    proxy.web(req, res, {
      target: service.targetUrl,
      proxyTimeout: service.proxyTimeout || config.proxy.defaultTimeout
    });
  } catch (error) {
    return showInternalError(error, req, res);
  }
};
