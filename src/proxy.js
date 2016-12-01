let httpProxy = require('http-proxy'),
  serviceRepository = require("./repositories/ServiceRepository"),
  stubResolver = require("./proxy/stubResolver"),
  url = require("url");
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
    res.writeHead(stub.response.statusCode, stub.response.headers);
    res.end(stub.response.body);

    return true;
  }

  return false;
}

proxy.on('error', function (err, req, res) {
  showError(res, 500, 'Error: ' + err.message)
});

module.exports = (req, res) => {
  serviceRepository.getByProxyHost(req.headers.host).then(services => {
    if (services.length == 0) {
      showError(res, 400, 'Proxy service mapping error');
      return;
    }

    let service = services[0];
    if (isStubsApplied(service, req, res)) {
      return;
    }

    proxy.web(req, res, {
      target: service.targetUrl
    });

  }).catch(err => {
    showError(res, 500, 'Can not get proxy rules. Error:' + err.message);
  });
};
