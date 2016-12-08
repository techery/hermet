'use strict';

let httpProxy = require('http-proxy'),
  config = require('./config'),
  logger = require('./components/logger').proxyLogger,
  serviceRepository = require('./repositories/ServiceRepository'),
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

function showInternalError(err, req) {
  logger.error(err.message +
    '\r\nRequest: ' + logger.curlify(req, req.body || null) +
    '\r\n' +  err.stack
  );
  showError(res, 500, 'Proxy error');
}

function isStubsApplied(service, req, res) {
  if (!service.stubs) {
    return false;
  }

  let stub = stubResolver.resolveStubByRequest(service.stubs, req);
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
  showInternalError(err, req);
});

module.exports = (req, res) => {
  serviceRepository.getByProxyHost(req.headers.host).catch(err => {
    let message = 'Can not get proxy rules for host: ' + req.headers.host;
    logger.error(message +  ' Error: ' + err.message);
    showError(res, 400, message);
  }).then(service => {
    if (!service || isStubsApplied(service, req, res)) {
      return;
    }
    proxy.web(req, res, {
      target: service.targetUrl,
      proxyTimeout: service.proxyTimeout || config.proxy.defaultTimeout
    });
  }).catch(err => {
    showInternalError(err, req);
  });
};
