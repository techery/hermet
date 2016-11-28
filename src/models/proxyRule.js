let couchbaseWrapper = require('../services/CouchbaseWrapper');

module.exports = couchbaseWrapper.ottoman.model("ProxyRule", {
  name: "string",
  proxyHost: "string",
  targetUrl: "string"
});