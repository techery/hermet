'use strict';

module.exports = {
  create: function(baseHost) {
    baseHost = baseHost || "";
    return {
      get: function (url, queryParams, headers) {
        var options = {
          resolveWithFullResponse: true,
          headers: headers,
          json: true
        };

        if (queryParams) {
          options.qs = queryParams;
        }

        return chakram.request("GET", baseHost + url, options);
      },

      post: function (url, body, queryParams, headers) {
        var options = {
          resolveWithFullResponse: true,
          headers: headers,
          json: body ? body : true
        };


        if (queryParams) {
          options.qs = queryParams;
        }

        return chakram.request("POST", baseHost + url, options);
      },

      put: function (url, body, queryParams, headers) {
        var options = {
          resolveWithFullResponse: true,
          headers: headers,
          json: body ? body : true
        };


        if (queryParams) {
          options.qs = queryParams;
        }

        return chakram.request("PUT", baseHost + url, options);
      },

      delete: function (url, queryParams, headers) {
        var options = {
          resolveWithFullResponse: true,
          headers: headers,
          json: true
        };

        if (queryParams) {
          options.qs = queryParams;
        }

        return chakram.request("DELETE", baseHost + url, options);
      }
    }
  }
};

