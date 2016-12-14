'use strict';

let httpProxy = require('http-proxy'),
  _ = require('lodash'),
  config = require('./config'),
  logger = require('./components/logger').proxyLogger,
  serviceRepository = require('./repositories/elastic/ServiceRepository'),
  stubRepository = require('./repositories/elastic/StubsRepository'),
  stubResolver = require('./proxy/stubResolver');

//
// Create a proxy server with custom application logic
//
let proxy = httpProxy.createProxy({});

function showError(res, status, message) {
  res.writeHead(status, {
    'Content-Type': 'text/plain'
  });
  res.end(message);
}

function showInternalError(err, req, res) {
  logger.error(err.message +
    '\r\nRequest: ' + logger.curlify(req, req.body || null) +
    '\r\n' +  err.stack
  );
  showError(res, 500, 'Proxy error');
}

function isStubsApplied(stubs, req, res) {

  let stub = stubResolver.resolveStubByRequest(stubs, req);
  if (stub) {
    let statusCode = stub.response.statusCode || 200,
       headers = stub.response.headers || {},
       body = stub.response.body || "";

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
    logger.error(message +  ' Error: ' + err.message);
    return showError(res, 400, message);
  }

  try {
    let sessionId = req.headers[config.app.hermet_session_header] || 'default';
    let stubs = await stubRepository
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
