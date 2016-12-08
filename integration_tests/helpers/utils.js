'use strict';

let config = require("../config");
let httpCLient = require("./http_client").create();

module.exports = {
  getItemIdFromLocation: function(location) {
    return location.split("/").slice(-1)[0];
  },
  flushDB: function() {
    var auth = "Basic " + new Buffer(config.couchbase.user + ":" + config.couchbase.password).toString("base64");

    return httpCLient.post("http://" + config.couchbase.host + ":8091/pools/default/buckets/" + config.couchbase.bucket + "/controller/doFlush",
      {}, {},
      {
        Authorization: auth
      }
    );
  }
};
