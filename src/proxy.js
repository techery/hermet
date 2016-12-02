let httpProxy = require('http-proxy'),
  serviceRepository = require("./repositories/ServiceRepository"),
  stubResolver = require("./proxy/stubResolver");

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

function isStubsApplied(service, req, res) {
  if (!service.stubs) {
    return false;
  }

  let stub = stubResolver.resolveStubByRequest(service.stubs, req);
  if (stub) {
    res.writeHead(stub.response.statusCode || 200, stub.response.headers || {});
    res.end(JSON.stringify(stub.response.body));

    return true;
  }

  return false;
}

proxy.on('error', function (err, req, res) {
  showError(res, 500, 'Error: ' + err.message)
});

module.exports = (req, res) => {
  serviceRepository.getByProxyHost(req.headers.host).then(service => {

    if (isStubsApplied(service, req, res)) {
      return;
    }

    proxy.web(req, res, {
      target: service.targetUrl
    });

  }).catch(err => {
    showError(res, 400, 'Can not get proxy rules. Error:' + err.message);
  });
};
