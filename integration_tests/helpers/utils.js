'use strict';

let config = require("../config");
let httpCLient = require("./http_client").create();

module.exports = {
  getItemIdFromLocation: function (location) {
    return location.split("/").slice(-1)[0];
  },
  flushDB: function () {
    if (config.standalone) {
      return hermetApiClient.post('/flush').then(function (result) {
        return result;
      });
    } else {
      return httpCLient.delete('http://localhost:9200/hermet').then(function (response) {
        return httpCLient.put('http://localhost:9200/hermet', {
          "mappings": {
            "service": {
              "properties": {
                "proxyHost": {
                  "type": "keyword"
                }
              }
            },
            "stub": {
              "properties": {
                "response": {
                  "enabled": false
                },
                "predicates": {
                  "enabled": false
                },
                "serviceId": {
                  "type":  "keyword"
                },
                "sessionId": {
                  "type":  "keyword"
                }
              }
            }
          }
        }).then(function (response) {
          return response;
        });
      });
    }
  }
};
