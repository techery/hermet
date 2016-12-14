'use strict';

let config = require("../config");
let httpCLient = require("./http_client").create();

module.exports = {
  getItemIdFromLocation: function (location) {
    return location.split("/").slice(-1)[0];
  },
  flushDB: function () {
    return httpCLient.delete('http://localhost:9200/hermet').then(function (response) {
    //  console.log(response);
      return httpCLient.put('http://localhost:9200/hermet', {
        "mappings": {
          "service": {}, "stub": {
            "_parent": {"type": "service"}, "properties": {
              "response": {
                "enabled": false
              },
              "predicates": {
                "enabled": false
              }
            }
          }
        }
      }).then(function (response) {
       // console.log(response);
        return response;
      });
    })
  }
};
