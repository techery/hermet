let httpProxy = require('http-proxy'),
  serviceRepository = require("./repositories/ServiceRepository");

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

// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
  showError(res, 500, 'Error: ' + err.message)
});

module.exports = (req, res) => {
  serviceRepository.getByProxyHost(req.headers.host).then(services => {
    if (services.length == 0) {
      showError(res, 400, 'Proxy service mapping error');
      return;
    }

    proxy.web(req, res, {
      target: services[0].targetUrl
    });
  }).catch(err => {
    showError(res, 500, 'Can not get proxy rules. Error:' + err.message);
  });
};
