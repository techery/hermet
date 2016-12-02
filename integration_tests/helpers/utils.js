'use strict';

let httpCLient = require("./http_client").create();

module.exports = {
  getItemIdFromLocation: function(location) {
    return location.split("/").slice(-1)[0];
  },
  flushDB: function() {
      var username = "root",
      password = "techery",
      auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

    return httpCLient.post("http://localhost:8091/pools/default/buckets/hernet/controller/doFlush", {}, {},
      {
        Authorization: auth
      }
    );
  }
};