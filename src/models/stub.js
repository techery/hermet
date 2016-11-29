let couchbaseWrapper = require('../services/CouchbaseWrapper');

module.exports = couchbaseWrapper.ottoman.model("Stub", {
  response: "string",
  predicates: "string"
});