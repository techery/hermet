let httpProxy = require('http-proxy'),
  serviceRepository = require("./repositories/ServiceRepository"),
  serviceMapping = require("./resources/serviceMapping");
//
// Create a proxy server with custom application logic
//
let proxy = httpProxy.createProxy({});

// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Error: ' + err.message);
});


module.exports = (req, res) => {
  let service = serviceMapping.find(service => {
    return req.headers.host == service.proxyHost;
  });

  if (!service) {
    res.writeHead(400, {
      'Content-Type': 'text/plain'
    });
    res.end('Proxy service mapping error');
    return;
  }
  proxy.web(req, res, {
    target: service.targetUrl
  });
};
